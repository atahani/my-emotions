import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { CustomRequest } from 'common/types'

export const CurrentAppId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const { req } = GqlExecutionContext.create(ctx).getContext<{ req: CustomRequest }>()
    return req.appId
})
