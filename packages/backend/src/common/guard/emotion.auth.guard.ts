import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql'
import { Response as ExpressResponse } from 'express'

import { CustomRequest } from 'common/types'

import { AuthService } from 'modules/auth/auth.service'
import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID, COOKIE_REFRESH_TOKEN } from 'common/constants'
import { getDefaultCookieOptions } from 'common/options'

@Injectable()
export class EmotionAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const context = GqlExecutionContext.create(ctx)
        // in subscription mode we get ws.UpgradeReq from connection which we passed on the graphql configuration
        const { req: graphqlReq, res, connection } = context.getContext<{
            req: CustomRequest
            res: ExpressResponse
            connection: { context: { req: CustomRequest } }
        }>()
        const req = graphqlReq ? graphqlReq : connection.context.req

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

                if (res) {
                    res.cookie(COOKIE_ACCESS_TOKEN, ac.accessToken, getDefaultCookieOptions())
                    res.cookie(COOKIE_REFRESH_TOKEN, ac.refreshToken, getDefaultCookieOptions())
                }

                req.userId = userAuthData.id
                req.appId = appId
                return true
            } else if (res) {
                // the refresh token is not valid so clear the related cookies
                res.clearCookie(COOKIE_ACCESS_TOKEN, getDefaultCookieOptions())
                res.clearCookie(COOKIE_REFRESH_TOKEN, getDefaultCookieOptions())
                res.clearCookie(COOKIE_APP_ID, getDefaultCookieOptions())
            }
        }
        return false
    }
}
