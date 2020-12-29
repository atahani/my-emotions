import { Injectable } from '@nestjs/common'

import { AccessTokenData, TokenValidationResult } from 'common/types'
import { ThirdPartyAuthenticatorType, User } from '@my-emotions/types'

import { RedisService } from 'common/service/redis.service'
import { UserAppService } from 'common/service/userApp.service'

@Injectable()
export class AuthService {
    constructor(private readonly redisService: RedisService, private readonly userAppService: UserAppService) {}

    async getAccessToken(user: User, authenticatorType: ThirdPartyAuthenticatorType = null): Promise<AccessTokenData> {
        const { app, clearToken } = await this.userAppService.create(user.id, authenticatorType)
        await this.redisService.setUserToken(app.id, user.id, clearToken)
        return {
            appId: app.id,
            accessToken: clearToken,
        }
    }

    async validateToken(appId: string, token: string): Promise<TokenValidationResult | undefined> {
        const id = await this.redisService.getUserId(appId, token)
        if (!id) {
            return await this.validateTokenFallback(appId, token)
        }
        return {
            id,
            appId,
        }
    }

    private async validateTokenFallback(appId: string, token: string): Promise<TokenValidationResult | undefined> {
        const userId = await this.userAppService.getUserIdByToken(appId, token)
        if (!userId) {
            return undefined
        }
        await this.redisService.setUserToken(appId, userId, token)
        return { id: userId, appId }
    }
}
