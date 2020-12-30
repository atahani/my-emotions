import { Module } from '@nestjs/common'

import { AuthService } from 'modules/auth/auth.service'
import { EmotionModule } from 'modules/emotion/emotion.module'
import { UserService } from 'common/service/user.service'

import { TestingHelperController } from './testingHelper.controller'

@Module({
    imports: [EmotionModule],
    providers: [UserService, AuthService],
    controllers: [TestingHelperController],
})
export class TestingHelperModule {}
