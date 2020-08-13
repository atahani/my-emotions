import { ConfigService } from 'nestjs-config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'

import { GoogleUserProfile, PassportUserData, ThirdPartyAuthenticatorType } from '@my-emotions/types'

import { Injectable } from '@nestjs/common'

@Injectable()
export class GooglePassportStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(config: ConfigService) {
        super({
            clientID: config.get('auth.googleClientId'),
            clientSecret: config.get('auth.googleSecret'),
            callbackURL: config.get('auth.googleCallbackURL'),
            scope: ['email', 'profile'],
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: GoogleUserProfile,
        done: VerifyCallback,
    ): Promise<any> {
        const user = {
            id: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayName: profile.displayName,
            imageURL: profile.photos[0].value,
            accessToken,
            refreshToken,
            thirdPartyAuthenticatorType: ThirdPartyAuthenticatorType.GOOGLE,
        } as PassportUserData
        done(null, user)
    }
}
