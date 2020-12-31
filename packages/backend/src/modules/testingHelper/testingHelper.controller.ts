import { Body, Controller, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common'

import {
    ActionStatus,
    LoginTestUserInput,
    SignUpTestUserInput,
    ThirdPartyAuthenticatorType,
    UserProfileView,
} from '@my-emotions/types'

import { AuthService } from 'modules/auth/auth.service'
import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID } from 'common/constants'
import { CurrentUserId, SetCookie } from 'common/decorator'
import { EmotionAuthGuard, TestingModeGuard } from 'common/guard'
import { EmotionService } from 'modules/emotion/emotion.service'
import { PostgresService } from 'common/service/pg.service'
import { UserService } from 'common/service/user.service'

@UseGuards(TestingModeGuard)
@Controller('/testing-helper')
export class TestingHelperController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly pgService: PostgresService,
        private readonly emotionService: EmotionService,
    ) {}

    @Post('/db/wipe')
    async wipeDatabaseData(): Promise<ActionStatus> {
        await this.pgService.runQuery(`TRUNCATE m_user, user_app, emotion cascade;`)
        return new ActionStatus('successfully wipe database data.')
    }

    @Post('/user/signup')
    async signUpTestUser(
        @Body() input: SignUpTestUserInput,
        @SetCookie() setCookie: SetCookie,
    ): Promise<UserProfileView> {
        const user = await this.userService.registerByPassport({
            id: input.email,
            thirdPartyAuthenticatorType: ThirdPartyAuthenticatorType.GOOGLE,
            accessToken: 'accessToken',
            firstName: input.firstName,
            lastName: input.lastName,
            displayName: `${input.firstName} ${input.lastName}`,
            email: input.email,
        })
        const tokenData = await this.authService.getAccessToken(user, ThirdPartyAuthenticatorType.GOOGLE)
        setCookie(COOKIE_ACCESS_TOKEN, tokenData.accessToken, { path: '/' })
        setCookie(COOKIE_APP_ID, tokenData.appId, { path: '/' })
        return await this.userService.getUserProfileViewById(user.id)
    }

    @UseGuards(EmotionAuthGuard)
    @Post('/emotions/insert/bulk')
    async insertTonsOfEmotions(@CurrentUserId() userId: string, @Query('count') count = 45): Promise<ActionStatus> {
        const tasks = []
        let i = count
        while (i > 0) {
            tasks.push(this.emotionService.create(userId, `emotion is testing ${i}`, `🧪`))
            i--
        }
        await Promise.all(tasks)
        return new ActionStatus(`${count} emotions has been created.`)
    }
}
