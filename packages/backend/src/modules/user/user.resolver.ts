import { Resolver, Query } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { UserProfileView } from '@my-emotions/types'

import { CurrentUserId } from 'common/decorator'
import { EmotionAuthGuard } from 'common/guard'
import { UserService } from 'common/service/user.service'

@UseGuards(EmotionAuthGuard)
@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserProfileView)
    async profile(@CurrentUserId() userId: string): Promise<UserProfileView> {
        return this.userService.getUserProfileViewById(userId)
    }
}
