import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Emotion } from '@my-emotions/types'

import { PostgresListenerService } from 'common/service/pg.listener.service'

import { EmotionResolver } from './emotion.resolver'
import { EmotionService } from './emotion.service'

@Module({
    imports: [TypeOrmModule.forFeature([Emotion])],
    providers: [EmotionService, EmotionResolver, PostgresListenerService],
})
export class EmotionModule {}
