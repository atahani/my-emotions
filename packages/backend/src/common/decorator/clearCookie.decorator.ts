import { CookieOptions, Response as ExpressResponse } from 'express'
import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext, GqlContextType } from '@nestjs/graphql'

import { getDefaultCookieOptions } from 'common/options'

export type ClearCookie = (name: string, options?: CookieOptions) => void

export const ClearCookie = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    return (name: string, options: CookieOptions = getDefaultCookieOptions()) => {
        let res: ExpressResponse
        switch (ctx.getType<GqlContextType>()) {
            case 'graphql':
                res = GqlExecutionContext.create(ctx).getContext<{ res: ExpressResponse }>().res
                break
            case 'http':
                res = ctx.switchToHttp().getResponse<ExpressResponse>()
                break
            default:
                break
        }
        if (res) {
            res.clearCookie(name, options)
        }
    }
})
