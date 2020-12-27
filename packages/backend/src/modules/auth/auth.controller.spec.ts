import { AuthGuard } from '@nestjs/passport'
import { BadRequestException, CanActivate } from '@nestjs/common'
import { ConfigService } from 'nestjs-config'
import { Test, TestingModule } from '@nestjs/testing'

import { ThirdPartyAuthenticatorType, User } from '@my-emotions/types'

import { AccessTokenData } from 'common/types'
import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID, COOKIE_REFRESH_TOKEN } from 'common/constants'
import { UserService } from 'common/service/user.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
    let controller: AuthController
    let userService: UserService
    let authService: AuthService
    let user: User

    beforeEach(async () => {
        user = new User()
        user.id = 'userId'
        const mockGoogleAuthGuard: CanActivate = { canActivate: jest.fn(() => true) }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthController,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => key),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        getUserByProvider: jest.fn(), // spy based on the test case
                        registerByPassport: jest.fn().mockResolvedValue(user),
                    },
                },
                {
                    provide: AuthService,
                    useValue: {
                        getAccessToken: jest.fn().mockResolvedValue({
                            accessToken: 'accessToken',
                            appId: 'appId',
                            refreshToken: 'refreshToken',
                        } as AccessTokenData),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard('google'))
            .useValue(mockGoogleAuthGuard)
            .compile()

        controller = module.get<AuthController>(AuthController)
        userService = module.get<UserService>(UserService)
        authService = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('should define the googleAuth method', async () => {
        expect(controller.googleAuth).toBeDefined()
    })

    describe('googleAuthRedirect', () => {
        it(`should get bad request error when req.user doesn't provide the passport user data`, async () => {
            try {
                await controller.googleAuthRedirect({} as any, {} as any, jest.fn())
            } catch (error) {
                expect(error).toStrictEqual(
                    new BadRequestException('something wrong while getting the user google data'),
                )
            }
        })

        it('should register and authorize the new user', async () => {
            const setCookieFn = jest.fn()
            const redirectFn = jest.fn()
            const getUserByProviderSpy = jest.spyOn(userService, 'getUserByProvider').mockResolvedValue(undefined)
            const getAccessTokenSpy = jest.spyOn(authService, 'getAccessToken')

            await controller.googleAuthRedirect(
                { user: { id: 'userId' } } as any,
                { redirect: redirectFn } as any,
                setCookieFn,
            )

            expect(getUserByProviderSpy).toBeCalledWith({
                id: 'userId',
                providerType: ThirdPartyAuthenticatorType.GOOGLE,
            })
            expect(getAccessTokenSpy).toBeCalledWith(user, ThirdPartyAuthenticatorType.GOOGLE)
            expect(setCookieFn).toBeCalledWith(COOKIE_ACCESS_TOKEN, 'accessToken')
            expect(setCookieFn).toBeCalledWith(COOKIE_APP_ID, 'appId')
            expect(setCookieFn).toBeCalledWith(COOKIE_REFRESH_TOKEN, 'refreshToken')
            expect(redirectFn).toBeCalledWith(303, `client.pwaEndpoint/login/callback?userId=userId&appId=appId`)
        })

        it('should authorize the user which is already registered', async () => {
            const setCookieFn = jest.fn()
            const redirectFn = jest.fn()
            jest.spyOn(userService, 'getUserByProvider').mockResolvedValue(user)
            const registerByPassportSpy = jest.spyOn(userService, 'registerByPassport')

            await controller.googleAuthRedirect(
                { user: { id: 'userId' } } as any,
                { redirect: redirectFn } as any,
                setCookieFn,
            )

            expect(registerByPassportSpy).toBeCalledTimes(0)
            expect(setCookieFn).toBeCalledTimes(3)
            expect(redirectFn).toBeCalledTimes(1)
        })
    })
})
