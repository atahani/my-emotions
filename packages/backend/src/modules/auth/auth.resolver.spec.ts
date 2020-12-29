import { CanActivate, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { MutationStatus, UserApp } from '@my-emotions/types'

import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID } from 'common/constants'
import { EmotionAuthGuard } from 'common/guard'
import { UserAppService } from 'common/service/userApp.service'

import { AuthResolver } from './auth.resolver'

describe('AuthResolver', () => {
    let resolver: AuthResolver
    let service: UserAppService
    let userApp: UserApp

    beforeEach(async () => {
        const mockEmotionAuthGuard: CanActivate = { canActivate: jest.fn(() => true) }
        userApp = new UserApp()
        userApp.id = 'userAppId'
        userApp.userId = 'userId'
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolver,
                {
                    provide: UserAppService,
                    useValue: {
                        getApps: jest.fn().mockResolvedValue([userApp]),
                        revoke: jest.fn(), // should be spy based on the test case
                    },
                },
            ],
        })
            .overrideGuard(EmotionAuthGuard)
            .useValue(mockEmotionAuthGuard)
            .compile()

        resolver = module.get<AuthResolver>(AuthResolver)
        service = module.get<UserAppService>(UserAppService)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })

    describe('apps', () => {
        it('should return ', async () => {
            const getAppSpy = jest.spyOn(service, 'getApps')
            expect(await resolver.apps('userId')).toStrictEqual([userApp])
            expect(getAppSpy).toBeCalledWith('userId')
        })
    })

    describe('revoke', () => {
        it('should revoked user app from argument successfully', async () => {
            const revokeAppSpy = jest.spyOn(service, 'revoke').mockResolvedValue(true)
            expect(await resolver.revoke('currentUserAppId', 'userId', jest.fn(), 'appIdFromArg')).toStrictEqual(
                new MutationStatus(true, `successfully revoked the app.`),
            )
            expect(revokeAppSpy).toBeCalledWith('appIdFromArg', 'userId')
        })

        it('should got the not found exception with wrong appId from argument', async () => {
            jest.spyOn(service, 'revoke').mockResolvedValue(false)
            try {
                await resolver.revoke('currentUserAppId', 'userId', jest.fn(), 'incorrectAppId')
            } catch (error) {
                expect(error).toStrictEqual(new NotFoundException(`can't find any application with this id`))
            }
        })

        it('should call clearCookie fn three times when for the current userAppId', async () => {
            const clearCookieFn = jest.fn()
            const revokeAppSpy = jest.spyOn(service, 'revoke').mockResolvedValue(true)
            await resolver.revoke('currentUserId', 'userId', clearCookieFn)
            expect(revokeAppSpy).toBeCalledWith('currentUserId', 'userId')
            expect(clearCookieFn).toBeCalledWith(COOKIE_APP_ID)
            expect(clearCookieFn).toBeCalledWith(COOKIE_ACCESS_TOKEN)
        })
    })
})
