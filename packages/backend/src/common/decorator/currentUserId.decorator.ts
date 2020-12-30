import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'

import { CustomRequest } from 'common/types'

export const CurrentUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    let req: CustomRequest
    switch (ctx.getType<GqlContextType>()) {
        case 'graphql':
            req = GqlExecutionContext.create(ctx).getContext<{ req: CustomRequest }>().req
            break
        case 'http':
            req = ctx.switchToHttp().getRequest<CustomRequest>()
            break
        default:
            break
    }
    return req.userId
})
