import { ConfigService } from 'nestjs-config'
import { FORGOT_EMOTION, GET_EMOTION, GET_EMOTIONS, RELEASE_EMOTION, NEW_EMOTION } from 'common/utils/test.gql.utils'
import { GraphQLClient } from 'graphql-request'
import { INestApplication } from '@nestjs/common'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { Test, TestingModule } from '@nestjs/testing'
import { v4 } from 'uuid'
import { WebSocketLink } from 'apollo-link-ws'
import ApolloClient from 'apollo-client'
import ws from 'ws'

import { ActionStatus, EmotionView, PaginatedResponse, ReleaseEmotionInput, User } from '@my-emotions/types'

import { AppModule } from 'modules/app.module'
import { dropIfExistAndCreateDBInTestingMode } from 'common/utils'
import { PostgresListenerService } from 'common/service/pg.listener.service'
import { PostgresService } from 'common/service/pg.service'
import { RedisService } from 'common/service/redis.service'
import { TestingHelperService } from 'common/service/testingHelper.service'

describe('Emotion Module (e2e)', () => {
    const releaseEmotionInput = { text: 'I love e2e testing.', emoji: '😇' } as ReleaseEmotionInput
    let app: INestApplication
    let pgListenerService: PostgresListenerService
    let pgService: PostgresService
    let redisService: RedisService
    let testingHelperService: TestingHelperService
    let graphQLClient: GraphQLClient
    let apolloClient: ApolloClient<NormalizedCacheObject>
    let wsLink: WebSocketLink
    let testUser: User

    beforeAll(async () => {
        await dropIfExistAndCreateDBInTestingMode()

        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [TestingHelperService],
        }).compile()

        app = module.createNestApplication()
        const configService = module.get<ConfigService>(ConfigService)
        pgListenerService = module.get<PostgresListenerService>(PostgresListenerService)
        pgService = module.get<PostgresService>(PostgresService)
        redisService = module.get<RedisService>(RedisService)
        testingHelperService = module.get<TestingHelperService>(TestingHelperService)

        await app.init()
        await app.listen(configService.get('app.port'))
        await pgService.runSQLFiles()

        graphQLClient = new GraphQLClient(`http://127.0.0.1:${configService.get('app.port')}/graphql`)

        wsLink = new WebSocketLink({
            uri: `ws://127.0.0.1:${configService.get('app.port')}/graphql`,
            options: { reconnect: true, lazy: true },
            webSocketImpl: ws,
        })

        apolloClient = new ApolloClient({
            link: wsLink,
            cache: new InMemoryCache({ addTypename: false }),
        })

        testUser = await testingHelperService.registerTestUser()
    })

    afterEach(async () => {
        await testingHelperService.logoutTestUser()
        graphQLClient.setHeaders({})
    })

    afterAll(async () => {
        await apolloClient.clearStore()
        apolloClient.stop()
        ;(wsLink as any).subscriptionClient.close()
        await Promise.all([redisService.disconnect(), pgListenerService.end(), pgService.end(), app.close()])
    })

    describe('Mutation > releaseEmotion', () => {
        it('should be protected', async () => {
            try {
                await graphQLClient.request<any, { data: ReleaseEmotionInput }>(RELEASE_EMOTION, {
                    data: releaseEmotionInput,
                })
            } catch (error) {
                expect(error.response.errors[0].extensions.exception.status).toBe(403)
            }
        })

        it('should return emotion view after releasing the new emotion', async () => {
            await testingHelperService.loginTestUser()
            const result = await graphQLClient
                .setHeaders(testingHelperService.getAuthHeaders())
                .request<{ releaseEmotion: EmotionView }, { data: ReleaseEmotionInput }>(RELEASE_EMOTION, {
                    data: releaseEmotionInput,
                })
            expect(result.releaseEmotion.text).toBe(releaseEmotionInput.text)
            expect(result.releaseEmotion.emoji).toBe(releaseEmotionInput.emoji)
        })
    })

    describe('Mutation > forgotEmotion', () => {
        it('should be protected', async () => {
            try {
                await graphQLClient.request<any, { id: string }>(FORGOT_EMOTION, { id: v4() })
            } catch (error) {
                expect(error.response.errors[0].extensions.exception.status).toBe(403)
            }
        })

        it('should return a message which means can successfully forgot this emotion', async () => {
            await testingHelperService.loginTestUser()
            graphQLClient.setHeaders(testingHelperService.getAuthHeaders())
            const { releaseEmotion } = await graphQLClient.request<
                { releaseEmotion: EmotionView },
                { data: ReleaseEmotionInput }
            >(RELEASE_EMOTION, { data: releaseEmotionInput })
            const { forgotEmotion } = await graphQLClient.request<{ forgotEmotion: ActionStatus }, { id: string }>(
                FORGOT_EMOTION,
                { id: releaseEmotion.id },
            )
            expect(forgotEmotion.message).toBe(`Be sure; I've forgotten this emotion.`)
        })

        it(`should get not found error when can't find any emotion with this id which not belongs to this user`, async () => {
            await testingHelperService.loginTestUser()
            try {
                await graphQLClient
                    .setHeaders(testingHelperService.getAuthHeaders())
                    .request<{ forgotEmotion: ActionStatus }, { id: string }>(FORGOT_EMOTION, { id: v4() })
            } catch (error) {
                expect(error.response.errors[0].message).toBe(`can't find any emotion with this id`)
            }
        })
    })

    describe('Query > emotion', () => {
        it('should get not found error with random id', async () => {
            try {
                await graphQLClient.request<any, { id: string }>(GET_EMOTION, { id: v4() })
            } catch (error) {
                expect(error.response.errors[0].message).toBe(`can't find any emotion with this id`)
            }
        })

        it('should get emotion view', async () => {
            await testingHelperService.loginTestUser()
            graphQLClient.setHeaders(testingHelperService.getAuthHeaders())
            const { releaseEmotion } = await graphQLClient.request<
                { releaseEmotion: EmotionView },
                { data: ReleaseEmotionInput }
            >(RELEASE_EMOTION, { data: releaseEmotionInput })
            const { emotion } = await graphQLClient.request<{ emotion: EmotionView }, { id: string }>(GET_EMOTION, {
                id: releaseEmotion.id,
            })
            expect(emotion.text).toBe(releaseEmotion.text)
            expect(emotion.emoji).toBe(releaseEmotion.emoji)
            expect(emotion.userBriefProfileView.displayName).toBe(testUser.displayName)
            expect(emotion.userBriefProfileView.id).toBe(testUser.id)
        })
    })

    describe('Query > emotions', () => {
        it('should return list of emotions in paginated view', async () => {
            const { emotions } = await graphQLClient.request<{ emotions: PaginatedResponse<EmotionView> }>(GET_EMOTIONS)
            expect(emotions.page).toBe(1)
            expect(emotions.totalPage).toBe(1)
            expect(emotions.items.length).toBe(emotions.totalItems)
        })
    })

    describe('Subscription > newEmotion', () => {
        it('should get the new emotion when releasing one', async () => {
            const nextFn = jest.fn()
            const subscribe = apolloClient
                .subscribe<{ newEmotion: EmotionView }>({ query: NEW_EMOTION })
                .subscribe({ next: nextFn })
            await testingHelperService.loginTestUser()
            graphQLClient.setHeaders(testingHelperService.getAuthHeaders())
            const { releaseEmotion } = await graphQLClient.request<
                { releaseEmotion: EmotionView },
                { data: ReleaseEmotionInput }
            >(RELEASE_EMOTION, { data: releaseEmotionInput })
            subscribe.unsubscribe()
            expect(nextFn).toBeCalledTimes(1)
            expect(nextFn).toBeCalledWith({ data: { newEmotion: releaseEmotion } })
        })
    })
})
