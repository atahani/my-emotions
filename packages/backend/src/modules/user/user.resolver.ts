import { NotFoundException, UseGuards } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { UserProfileView } from '@my-emotions/types'

import { CurrentUserId } from 'common/decorator'
import { EmotionAuthGuard } from 'common/guard'
import { UserService } from 'common/service/user.service'

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @UseGuards(EmotionAuthGuard)
    @Query(() => UserProfileView)
    async myProfile(@CurrentUserId() currentUserId: string): Promise<UserProfileView> {
        return await this.userService.getUserProfileViewById(currentUserId)
    }

    @Query(() => UserProfileView)
    async profile(@Args('userId') userId: string): Promise<UserProfileView> {
        const profileView = await this.userService.getUserProfileViewById(userId)
        if (!profileView) {
            throw new NotFoundException(`can't found any user profile with this id`)
        }
        return profileView
    }
}
