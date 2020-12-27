import { ConfigService } from 'nestjs-config'
import { GraphQLClient } from 'graphql-request'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

import { MutationStatus, UserApp } from '@my-emotions/types'

import { AppModule } from 'modules/app.module'
import { dropIfExistAndCreateDBInTestingMode } from 'common/utils'
import { PostgresListenerService } from 'common/service/pg.listener.service'
import { PostgresService } from 'common/service/pg.service'
import { RedisService } from 'common/service/redis.service'
import { TestingHelperService } from 'common/service/testingHelper.service'
import { GET_APPS, REVOKE_APP } from 'common/utils/test.gql.utils'

describe('Auth Module (e2e)', () => {
    let app: INestApplication
    let testingHelperService: TestingHelperService
    let pgListenerService: PostgresListenerService
    let pgService: PostgresService
    let redisService: RedisService
    let req: request.SuperTest<request.Test>
    let graphQLClient: GraphQLClient

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

        req = request(app.getHttpServer())
        graphQLClient = new GraphQLClient(`http://127.0.0.1:${configService.get('app.port')}/graphql`)
        // register the test user
        await testingHelperService.registerTestUser()
    })

    afterEach(async () => {
        await testingHelperService.logoutTestUser()
        graphQLClient.setHeaders({})
    })

    afterAll(async () => {
        await Promise.all([redisService.disconnect(), pgListenerService.end(), pgService.end(), app.close()])
    })

    describe('GET > /auth/google', () => {
        it('should be redirected to google login page', () => {
            return req.get('/auth/google').expect(302)
        })
    })

    describe('GET > /google/redirect', () => {
        it('should be redirect to google', () => {
            return req.get('/auth/google/redirect').expect(302)
        })
    })

    describe('Query > apps', () => {
        it('should be protected', async () => {
            try {
                await graphQLClient.request(GET_APPS)
            } catch (error) {
                expect(error.response.errors[0].extensions.exception.status).toBe(403)
            }
        })

        it('should get apps', async () => {
            await testingHelperService.loginTestUser()
            const result = await graphQLClient
                .setHeaders(testingHelperService.getAuthHeaders())
                .request<{ apps: UserApp[] }>(GET_APPS)
            expect(result.apps.length).toBe(1)
        })
    })

    describe('Mutation > revoke', () => {
        it('should be protected', async () => {
            try {
                await graphQLClient.request(REVOKE_APP)
            } catch (error) {
                expect(error.response.errors[0].extensions.exception.status).toBe(403)
            }
        })

        it('should revoke the app', async () => {
            await testingHelperService.loginTestUser()
            const result = await graphQLClient
                .setHeaders(testingHelperService.getAuthHeaders())
                .request<{ revoke: MutationStatus }>(REVOKE_APP)
            expect(result.revoke.message).toBe('successfully revoked the app.')
        })
    })
})
