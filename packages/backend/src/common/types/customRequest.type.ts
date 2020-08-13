import * as core from 'express-serve-static-core'

import { PassportUserData } from '@my-emotions/types'

export interface CustomRequest<
    P extends core.Params = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query
> extends core.Request<P, ResBody, ReqBody, ReqQuery> {
    user: PassportUserData
    userId?: string
    appId?: string
}
