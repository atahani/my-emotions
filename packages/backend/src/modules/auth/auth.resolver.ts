import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'
import { UseGuards, NotFoundException } from '@nestjs/common'

import { UserApp, MutationStatus } from '@my-emotions/types'

import { COOKIE_ACCESS_TOKEN, COOKIE_APP_ID } from 'common/constants'
import { CurrentUserId, CurrentAppId, ClearCookie } from 'common/decorator'
import { EmotionAuthGuard } from 'common/guard'
import { UserAppService } from 'common/service/userApp.service'

@UseGuards(EmotionAuthGuard)
@Resolver()
export class AuthResolver {
    constructor(private readonly userAppService: UserAppService) {}

    @Query(() => [UserApp])
    async apps(@CurrentUserId() userId: string): Promise<UserApp[]> {
        return await this.userAppService.getApps(userId)
    }

    @Mutation(() => MutationStatus)
    async revoke(
        @CurrentAppId() currentAppId: string,
        @CurrentUserId() userId: string,
        @ClearCookie() clearCookie: ClearCookie,
        @Args('appId', { nullable: true }) appIdFromArg?: string,
    ): Promise<MutationStatus> {
        const canDoIt = await this.userAppService.revoke(appIdFromArg || currentAppId, userId)
        if (!canDoIt) {
            throw new NotFoundException(`can't find any application with this id`)
        }
        if (!appIdFromArg || appIdFromArg === currentAppId) {
            // so the currentAppId is revoked, should clear cookies
            clearCookie(COOKIE_APP_ID)
            clearCookie(COOKIE_ACCESS_TOKEN)
        }
        return new MutationStatus(true, 'successfully revoked the app.')
    }
}
