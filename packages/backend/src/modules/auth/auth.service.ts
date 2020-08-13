import { Injectable } from '@nestjs/common'

import { AccessTokenData, TokenValidationResult } from 'common/types'
import { ThirdPartyAuthenticatorType, User } from '@my-emotions/types'

import { generateRandomString } from 'common/utils'
import { RedisService } from 'common/service/redis.service'
import { UserAppService } from 'common/service/userApp.service'

@Injectable()
export class AuthService {
    constructor(private readonly redisService: RedisService, private readonly userAppService: UserAppService) {}

    async getAccessToken(user: User, authenticatorType: ThirdPartyAuthenticatorType = null): Promise<AccessTokenData> {
        const { app, clearRefreshToken } = await this.userAppService.create(user.id, authenticatorType)
        const accessToken = generateRandomString(24)
        await this.redisService.setUserToken(app.id, user.id, accessToken)
        return {
            appId: app.id,
            refreshToken: clearRefreshToken,
            accessToken,
        }
    }

    async validateToken(appId: string, token: string): Promise<TokenValidationResult | undefined> {
        const id = await this.redisService.getUserId(appId, token)
        if (!id) {
            return undefined
        }
        return {
            id,
            appId,
        }
    }

    async validateRefreshToken(appId: string, refreshToken: string): Promise<TokenValidationResult | undefined> {
        const id = await this.userAppService.getUserIdByRefreshToken(appId, refreshToken)
        if (!id) {
            return undefined
        }
        return { id, appId }
    }

    async refreshAccessToken(appId: string, userId: string): Promise<AccessTokenData> {
        const refreshToken = await this.userAppService.refreshIt(appId, userId)
        const accessToken = generateRandomString(24)
        await this.redisService.setUserToken(appId, userId, accessToken)
        return {
            appId,
            refreshToken,
            accessToken,
        }
    }
}
