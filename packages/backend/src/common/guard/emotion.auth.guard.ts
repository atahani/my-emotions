import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Response as ExpressResponse } from 'express'

import { CustomRequest } from 'common/types'

import { AuthService } from 'modules/auth/auth.service'
import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID, COOKIE_REFRESH_TOKEN } from 'common/constants'

@Injectable()
export class EmotionAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const context = GqlExecutionContext.create(ctx)
        const { req, res } = context.getContext<{ req: CustomRequest; res: ExpressResponse }>()
        const refreshToken = req.cookies[COOKIE_REFRESH_TOKEN]
        const appId = req.cookies[COOKIE_APP_ID]
        const token = req.cookies[COOKIE_ACCESS_TOKEN]
        if (!token || !appId) {
            return false
        }
        let userAuthData = await this.authService.validateToken(appId, token)
        if (userAuthData) {
            req.userId = userAuthData.id
            req.appId = appId
            return true
        }
        if (refreshToken) {
            // it means the token is expired and should refresh it
            userAuthData = await this.authService.validateRefreshToken(appId, refreshToken)
            if (userAuthData) {
                const ac = await this.authService.refreshAccessToken(appId, userAuthData.id)

                res.cookie(COOKIE_ACCESS_TOKEN, ac.accessToken, { sameSite: true })
                res.cookie(COOKIE_REFRESH_TOKEN, ac.refreshToken, { httpOnly: true, sameSite: true })

                req.userId = userAuthData.id
                req.appId = appId
                return true
            } else {
                // the refresh token is not valid so clear the related cookies
                res.clearCookie(COOKIE_ACCESS_TOKEN, { sameSite: true })
                res.clearCookie(COOKIE_REFRESH_TOKEN, { httpOnly: true, sameSite: true })
                res.clearCookie(COOKIE_APP_ID, { httpOnly: true, sameSite: true })
            }
        }
        return false
    }
}
