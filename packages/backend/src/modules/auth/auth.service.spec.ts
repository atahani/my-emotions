import { Test, TestingModule } from '@nestjs/testing'

import { User } from '@my-emotions/types'

import { AccessTokenData, TokenValidationResult } from 'common/types'
import { RedisService } from 'common/service/redis.service'
import { UserAppService } from 'common/service/userApp.service'

import { AuthService } from './auth.service'

const USER_ID = 'userId'
const APP_ID = 'appId'
const RANDOM_CHAR_AS_ACCESS_TOKEN = 'someRandomCharacterInStringAsAccessToken'
const CLEAR_REFRESH_TOKEN = 'clearRefreshToken'
const REFRESH_TOKEN = 'refreshToken'

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
                            .mockResolvedValue({ app: { id: APP_ID }, clearRefreshToken: CLEAR_REFRESH_TOKEN }),
                        getUserIdByRefreshToken: jest.fn().mockResolvedValue('userId'),
                        refreshIt: jest.fn().mockResolvedValue(CLEAR_REFRESH_TOKEN),
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
                refreshToken: CLEAR_REFRESH_TOKEN,
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

        it('should return undefined if pass incorrect token', async () => {
            jest.spyOn(redisService, 'getUserId').mockResolvedValue(undefined)
            expect(await service.validateToken(APP_ID, 'invalidToken')).toBeUndefined()
        })
    })

    describe('validateRefreshToken', () => {
        it('should return TokenValidationResult', async () => {
            const userAppGetUserIdByRefreshTokenSpy = jest.spyOn(userAppService, 'getUserIdByRefreshToken')
            expect(await service.validateRefreshToken(APP_ID, REFRESH_TOKEN)).toStrictEqual({
                id: USER_ID,
                appId: APP_ID,
            } as TokenValidationResult)
            expect(userAppGetUserIdByRefreshTokenSpy).toBeCalledWith(APP_ID, REFRESH_TOKEN)
        })

        it('should return undefined with invalid refresh token', async () => {
            jest.spyOn(userAppService, 'getUserIdByRefreshToken').mockResolvedValue(undefined)
            expect(await service.validateRefreshToken(APP_ID, 'invalidRefreshToken')).toBeUndefined()
        })
    })

    describe('refreshAccessToken', () => {
        it('should return access token data', async () => {
            const userAppRefreshItSpy = jest.spyOn(userAppService, 'refreshIt')
            const redisSetUserTokenSpy = jest.spyOn(redisService, 'setUserToken')
            expect(await service.refreshAccessToken(APP_ID, USER_ID)).toStrictEqual({
                appId: APP_ID,
                refreshToken: CLEAR_REFRESH_TOKEN,
                accessToken: RANDOM_CHAR_AS_ACCESS_TOKEN,
            } as AccessTokenData)
            expect(userAppRefreshItSpy).toBeCalledWith(APP_ID, USER_ID)
            expect(redisSetUserTokenSpy).toBeCalledWith(APP_ID, USER_ID, RANDOM_CHAR_AS_ACCESS_TOKEN)
        })

        it('should return undefined with invalid appId or userId', async () => {
            jest.spyOn(userAppService, 'refreshIt').mockResolvedValue(undefined)
            expect(await service.refreshAccessToken('badAppId', 'badUserId')).toBeUndefined()
        })
    })
})
