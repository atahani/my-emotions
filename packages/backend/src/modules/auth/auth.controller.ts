import { AuthGuard } from '@nestjs/passport'
import { Controller, Get, UseGuards, Request, BadRequestException, Response } from '@nestjs/common'
import { InjectConfig, ConfigService } from 'nestjs-config'
import { Response as ExpressResponse } from 'express'

import { CustomRequest } from 'common/types'
import { ThirdPartyAuthenticatorType } from '@my-emotions/types'

import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID } from 'common/constants'
import { SetCookie } from 'common/decorator'
import { UserService } from 'common/service/user.service'

import { AuthService } from './auth.service'

@Controller('/auth')
export class AuthController {
    constructor(
        @InjectConfig() private readonly config: ConfigService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(): Promise<void> {
        return
    }

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(
        @Request() req: CustomRequest,
        @Response() res: ExpressResponse,
        @SetCookie() setCookie: SetCookie,
    ): Promise<void> {
        if (!req.user) {
            throw new BadRequestException('something wrong while getting the user google data')
        }

        let user = await this.userService.getUserByProvider({
            id: req.user.id,
            providerType: ThirdPartyAuthenticatorType.GOOGLE,
        })
        if (!user) {
            user = await this.userService.registerByPassport(req.user)
        }

        const tokenData = await this.authService.getAccessToken(user, ThirdPartyAuthenticatorType.GOOGLE)

        setCookie(COOKIE_ACCESS_TOKEN, tokenData.accessToken)
        setCookie(COOKIE_APP_ID, tokenData.appId)

        res.redirect(
            303,
            `${this.config.get('client.pwaEndpoint')}/login/callback?userId=${user.id}&appId=${tokenData.appId}`,
        )
    }
}
