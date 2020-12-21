import { CookieOptions } from 'express'

export const getDefaultCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    path: process.env.API_PREFIX || '/graphql',
    secure: !process.env.APP_ENVIRONMENT || process.env.APP_ENVIRONMENT === 'local_development' ? false : true,
    sameSite: !process.env.APP_ENVIRONMENT || process.env.APP_ENVIRONMENT === 'local_development' ? undefined : 'none',
    maxAge: 30 * 24 * 60 * 60, // 30 days
})
