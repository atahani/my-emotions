import { ConfigService } from 'nestjs-config'
import { Test, TestingModule } from '@nestjs/testing'

import { GoogleUserProfile, PassportUserData, ThirdPartyAuthenticatorType } from '@my-emotions/types'

import { GooglePassportStrategy } from './google.passport.service'

const gProfile: GoogleUserProfile = {
    id: 'googleId',
    displayName: 'displayName',
    name: {
        familyName: 'familyName',
        givenName: 'givenName',
    },
    emails: [
        {
            value: 'email@mail.com',
            verified: true,
        },
    ],
    photos: [
        {
            value: 'imageURL',
        },
    ],
    provider: 'google',
}

describe('GooglePassportService', () => {
    let service: GooglePassportStrategy

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GooglePassportStrategy,
                {
                    provide: ConfigService,
                    useFactory: () => ({
                        get: jest.fn().mockImplementation((key: string) => key),
                    }),
                },
            ],
        }).compile()

        service = module.get<GooglePassportStrategy>(GooglePassportStrategy)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('service initialized', () => {
        it('initialized with configs', () => {
            const oauth2Config = (service as any)._oauth2
            expect(oauth2Config._clientId).toBe('auth.googleClientId')
            expect(oauth2Config._clientSecret).toBe('auth.googleSecret')
            expect((service as any)._callbackURL).toBe('auth.googleCallbackURL')
            expect((service as any)._scope).toStrictEqual(['email', 'profile'])
        })
    })

    describe('validate', () => {
        it('should call the done function with null and the user', async () => {
            const doneFn = jest.fn()
            await service.validate('accessToken', 'refreshToken', gProfile, doneFn)
            expect(doneFn).toBeCalledWith(null, {
                id: gProfile.id,
                email: gProfile.emails[0].value,
                firstName: gProfile.name.givenName,
                lastName: gProfile.name.familyName,
                displayName: gProfile.displayName,
                imageURL: gProfile.photos[0].value,
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                thirdPartyAuthenticatorType: ThirdPartyAuthenticatorType.GOOGLE,
            } as PassportUserData)
        })
    })
})
