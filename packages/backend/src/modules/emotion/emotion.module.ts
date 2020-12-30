import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Emotion } from '@my-emotions/types'

import { DateScalar } from 'common/scalar'
import { PostgresListenerService } from 'common/service/pg.listener.service'

import { EmotionResolver } from './emotion.resolver'
import { EmotionService } from './emotion.service'

@Module({
    imports: [TypeOrmModule.forFeature([Emotion])],
    providers: [DateScalar, EmotionService, EmotionResolver, PostgresListenerService],
    exports: [TypeOrmModule.forFeature([Emotion]), EmotionService, PostgresListenerService],
})
export class EmotionModule {}
