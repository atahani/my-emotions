import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { Response as ExpressResponse } from 'express'

import { CustomRequest } from 'common/types'

import { AuthService } from 'modules/auth/auth.service'
import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID } from 'common/constants'
import { getDefaultCookieOptions } from 'common/options'

@Injectable()
export class EmotionAuthGuard implements CanActivate {
    private readonly inTestingMode = process.env.NODE_ENV === 'test'
    constructor(private readonly authService: AuthService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        let req: CustomRequest
        let res: ExpressResponse
        switch (ctx.getType<GqlContextType>()) {
            case 'graphql': {
                const context = GqlExecutionContext.create(ctx)
                // in subscription mode we get ws.UpgradeReq from connection which we passed on the graphql configuration
                const { req: graphqlReq, res: graphqlRes, connection } = context.getContext<{
                    req: CustomRequest
                    res: ExpressResponse
                    connection: { context: { req: CustomRequest } }
                }>()
                req = graphqlReq ? graphqlReq : connection.context.req
                res = graphqlRes
                break
            }
            case 'http':
                req = ctx.switchToHttp().getRequest<CustomRequest>()
                res = ctx.switchToHttp().getResponse<ExpressResponse>()
            default:
                break
        }

        if (!req && !req.cookies && !this.inTestingMode) {
            return false
        }

        const appId =
            req.cookies && req.cookies[COOKIE_APP_ID] ? req.cookies[COOKIE_APP_ID] : req.headers[COOKIE_APP_ID]
        const token =
            req.cookies && req.cookies[COOKIE_ACCESS_TOKEN]
                ? req.cookies[COOKIE_ACCESS_TOKEN]
                : req.headers[COOKIE_ACCESS_TOKEN]

        if (!token || !appId) {
            return false
        }
        const userAuthData = await this.authService.validateToken(appId, token)
        if (userAuthData) {
            req.userId = userAuthData.id
            req.appId = appId
            return true
        }
        // the cookies are not valid so should remove it as logout
        res.clearCookie(COOKIE_ACCESS_TOKEN, getDefaultCookieOptions(-1))
        res.clearCookie(COOKIE_APP_ID, getDefaultCookieOptions(-1))
        return false
    }
}
