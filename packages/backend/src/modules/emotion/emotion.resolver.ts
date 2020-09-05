import { NotFoundException, UseGuards } from '@nestjs/common'
import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql'

import { ReleaseEmotionInput, ActionStatus, EmotionView } from '@my-emotions/types'

import { CurrentUserId } from 'common/decorator'
import { EmotionAuthGuard } from 'common/guard'

import { EmotionService } from './emotion.service'

@UseGuards(EmotionAuthGuard)
@Resolver()
export class EmotionResolver {
    constructor(private readonly emotionService: EmotionService) {}

    @Mutation(() => String)
    async releaseEmotion(
        @CurrentUserId() userId: string,
        @Args('data') { text, emoji }: ReleaseEmotionInput,
    ): Promise<string> {
        const emotion = await this.emotionService.create(userId, text, emoji)
        return emotion.id
    }

    @Mutation(() => ActionStatus)
    async forgotEmotion(@CurrentUserId() userId: string, @Args('id') id: string): Promise<ActionStatus> {
        const canDoIt = await this.emotionService.delete(id, userId)
        if (!canDoIt) {
            throw new NotFoundException(`can't find any emotion with this id`)
        }
        return new ActionStatus(`Be sure; I've forgotten this emotion.`)
    }

    @Query(() => [EmotionView])
    async emotions(
        @Args('userId', { nullable: true }) userId: string,
        @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
        @Args('offset', { nullable: true, defaultValue: 0 }) offset: number,
    ): Promise<EmotionView[]> {
        if (userId) {
            return await this.emotionService.getUserEmotions(userId, offset, limit)
        }
        return await this.emotionService.getEmotions(offset, limit)
    }

    @Query(() => EmotionView)
    async emotion(@Args('id') id: string): Promise<EmotionView> {
        const emotion = await this.emotionService.getEmotion(id)
        if (!emotion) {
            throw new NotFoundException(`can't find any emotion with this id`)
        }
        return emotion
    }

    @Subscription(() => EmotionView, {
        resolve(this, value) {
            return { ...value, createdAt: new Date(value.createdAt) }
        },
    })
    newEmotion(): AsyncIterator<EmotionView> {
        return this.emotionService.notifyNewEmotion()
    }
}
