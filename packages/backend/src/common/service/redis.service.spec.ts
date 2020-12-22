import { ConfigService } from 'nestjs-config'
import { Test, TestingModule } from '@nestjs/testing'

import { RedisService } from './redis.service'

describe('RedisService', () => {
    let service: RedisService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RedisService,
                {
                    provide: ConfigService,
                    useFactory: () => ({
                        get: jest.fn().mockImplementation((key: string) => key),
                    }),
                },
            ],
        }).compile()

        service = module.get<RedisService>(RedisService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('_accessTokenKey', () => {
        it('should return key', () => {
            expect(service['_accessTokenKey']('appId', 'token')).toBe(
                `${service['USER_PREFIX']}:appId:access_token:token`,
            )
        })
    })

    describe('setUserToken', () => {
        it('should set user token', async () => {
            const redisSetSpy = jest.spyOn(service['redis'], 'set').mockImplementation(() => 'Ok')
            expect(await service.setUserToken('appId', 'userId', 'token')).toBe('Ok')
            expect(redisSetSpy).toBeCalledWith(
                service['_accessTokenKey']('appId', 'token'),
                'userId',
                'ex',
                60 * service['tokenExpiresInMin'],
            )
        })
    })

    describe('getUserId', () => {
        it('should return userId', async () => {
            const redisGetSpy = jest.spyOn(service['redis'], 'get').mockResolvedValue('userId')
            expect(await service.getUserId('appId', 'token')).toBe('userId')
            expect(redisGetSpy).toBeCalledWith(service['_accessTokenKey']('appId', 'token'))
        })
    })
})
