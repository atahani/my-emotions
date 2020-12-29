import { Test, TestingModule } from '@nestjs/testing'

import { User } from '@my-emotions/types'

import { AccessTokenData, TokenValidationResult } from 'common/types'
import { RedisService } from 'common/service/redis.service'
import { UserAppService } from 'common/service/userApp.service'

import { AuthService } from './auth.service'

const USER_ID = 'userId'
const APP_ID = 'appId'
const RANDOM_CHAR_AS_ACCESS_TOKEN = 'someRandomCharacterInStringAsAccessToken'

jest.mock('common/utils', () => ({ generateRandomString: () => RANDOM_CHAR_AS_ACCESS_TOKEN }))

describe('AuthService', () => {
    let service: AuthService
    let redisService: RedisService
    let userAppService: UserAppService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: RedisService,
                    useValue: {
                        setUserToken: jest.fn(),
                        getUserId: jest.fn().mockResolvedValue(USER_ID),
                    },
                },
                {
                    provide: UserAppService,
                    useValue: {
                        create: jest
                            .fn()
                            .mockResolvedValue({ app: { id: APP_ID }, clearToken: RANDOM_CHAR_AS_ACCESS_TOKEN }),
                        getUserIdByToken: jest.fn().mockResolvedValue('userId'),
                        It: jest.fn().mockResolvedValue(RANDOM_CHAR_AS_ACCESS_TOKEN),
                    },
                },
            ],
        }).compile()

        service = module.get<AuthService>(AuthService)
        redisService = module.get<RedisService>(RedisService)
        userAppService = module.get<UserAppService>(UserAppService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getAccessToken', () => {
        it('should return access token data', async () => {
            const userAppCreateSpy = jest.spyOn(userAppService, 'create')
            const redisSetUserTokenSpy = jest.spyOn(redisService, 'setUserToken')
            expect(await service.getAccessToken({ id: USER_ID } as User)).toStrictEqual({
                appId: APP_ID,
                accessToken: RANDOM_CHAR_AS_ACCESS_TOKEN,
            } as AccessTokenData)
            expect(userAppCreateSpy).toBeCalledWith(USER_ID, null)
            expect(redisSetUserTokenSpy).toBeCalledWith(APP_ID, USER_ID, RANDOM_CHAR_AS_ACCESS_TOKEN)
        })
    })

    describe('validateToken', () => {
        it('should return TokenValidationResult', async () => {
            const redisGetUserIdSpy = jest.spyOn(redisService, 'getUserId')
            expect(await service.validateToken(APP_ID, RANDOM_CHAR_AS_ACCESS_TOKEN)).toStrictEqual({
                id: USER_ID,
                appId: APP_ID,
            } as TokenValidationResult)
            expect(redisGetUserIdSpy).toBeCalledWith(APP_ID, RANDOM_CHAR_AS_ACCESS_TOKEN)
        })
    })
    describe('validateTokenFallback', () => {
        it('should return userId as fallback from database', async () => {
            const getUserIdByTokenSpy = jest.spyOn(userAppService, 'getUserIdByToken')
            const redisSetUserTokenSpy = jest.spyOn(redisService, 'setUserToken')
            await service['validateTokenFallback']('appId', 'token')
            expect(getUserIdByTokenSpy).toBeCalledWith('appId', 'token')
            expect(redisSetUserTokenSpy).toBeCalledWith('appId', 'userId', 'token')
        })
    })
})
