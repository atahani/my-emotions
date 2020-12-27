import { Injectable } from '@nestjs/common'

import { ThirdPartyAuthenticatorType, User } from '@my-emotions/types'
import { AccessTokenData } from 'common/types'

import { AuthService } from 'modules/auth/auth.service'
import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID, COOKIE_REFRESH_TOKEN } from 'common/constants'
import { UserAppService } from 'common/service/userApp.service'
import { UserService } from 'common/service/user.service'

@Injectable()
export class TestingHelperService {
    private currentTestUserAccessTokenData: AccessTokenData
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly userAppService: UserAppService,
    ) {}

    async registerTestUser(
        providerId = 'googleId',
        email = 'email@mail.com',
        firstName = 'firstName',
        lastName = 'lastName',
        imageURL = 'imageURL',
        providerType = ThirdPartyAuthenticatorType.GOOGLE,
    ): Promise<User> {
        return await this.userService.registerByPassport({
            id: providerId,
            thirdPartyAuthenticatorType: providerType,
            accessToken: 'accessToken',
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`,
            email,
            imageURL,
        })
    }

    async loginTestUser(id = 'googleId', providerType = ThirdPartyAuthenticatorType.GOOGLE): Promise<AccessTokenData> {
        const user = await this.userService.getUserByProvider({ id, providerType })
        this.currentTestUserAccessTokenData = await this.authService.getAccessToken(user)
        return this.currentTestUserAccessTokenData
    }

    async logoutTestUser(
        appId?: string,
        id = 'googleId',
        providerType = ThirdPartyAuthenticatorType.GOOGLE,
    ): Promise<boolean> {
        if (this.currentTestUserAccessTokenData) {
            const user = await this.userService.getUserByProvider({ id, providerType })
            const result = await this.userAppService.revoke(appId || this.currentTestUserAccessTokenData.appId, user.id)
            this.currentTestUserAccessTokenData = null
            return result
        }
        return false
    }

    getAuthHeaders() {
        return {
            [COOKIE_ACCESS_TOKEN]: this.currentTestUserAccessTokenData.accessToken,
            [COOKIE_APP_ID]: this.currentTestUserAccessTokenData.appId,
            [COOKIE_REFRESH_TOKEN]: this.currentTestUserAccessTokenData.refreshToken,
        }
    }
}
