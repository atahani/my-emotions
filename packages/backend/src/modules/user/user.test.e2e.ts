import { ConfigService } from 'nestjs-config'
import { gql, GraphQLClient } from 'graphql-request'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { User, UserProfileView } from '@my-emotions/types'

import { AppModule } from 'modules/app.module'
import { dropIfExistAndCreateDBInTestingMode } from 'common/utils'
import { PostgresListenerService } from 'common/service/pg.listener.service'
import { PostgresService } from 'common/service/pg.service'
import { RedisService } from 'common/service/redis.service'
import { TestingHelperService } from 'common/service/testingHelper.service'
import { GET_MY_PROFILE, GET_PROFILE } from 'common/utils/test.gql.utils'

describe('User Module (e2e)', () => {
    let app: INestApplication
    let pgListenerService: PostgresListenerService
    let pgService: PostgresService
    let redisService: RedisService
    let testingHelperService: TestingHelperService
    let graphQLClient: GraphQLClient
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

        graphQLClient = new GraphQLClient(`http://127.0.0.1:${configService.get('app.port')}/graphql`)

        testUser = await testingHelperService.registerTestUser()
    })

    afterEach(async () => {
        await testingHelperService.logoutTestUser()
        graphQLClient.setHeaders({})
    })

    afterAll(async () => {
        await Promise.all([redisService.disconnect(), pgListenerService.end(), pgService.end(), app.close()])
    })

    describe('Query > myProfile', () => {
        it('should be protected', async () => {
            try {
                await graphQLClient.request(GET_MY_PROFILE)
            } catch (error) {
                expect(error.response.errors[0].extensions.exception.status).toBe(403)
            }
        })

        it('should get the profile of current user', async () => {
            await testingHelperService.loginTestUser()
            const result = await graphQLClient
                .setHeaders(testingHelperService.getAuthHeaders())
                .request<{ myProfile: UserProfileView }>(GET_MY_PROFILE)
            expect(result.myProfile.firstName).toBe(testUser.firstName)
        })
    })

    describe('Query > profile', () => {
        it('should get profile without authentication', async () => {
            const result = await graphQLClient.request<{ profile: UserProfileView }, { userId: string }>(GET_PROFILE, {
                userId: testUser.id,
            })
            expect(result.profile.lastName).toBe(testUser.lastName)
            expect(result.profile.email).toBe(testUser.email)
        })
    })
})
