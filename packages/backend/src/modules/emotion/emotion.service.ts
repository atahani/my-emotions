import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Emotion, EmotionView, PaginatedResponse } from '@my-emotions/types'

import { PostgresListenerService } from 'common/service/pg.listener.service'
import { PostgresService } from 'common/service/pg.service'

@Injectable()
export class EmotionService {
    constructor(
        @InjectRepository(Emotion) private readonly emotionRepository: Repository<Emotion>,
        private readonly pgService: PostgresService,
        private readonly pgListener: PostgresListenerService,
    ) {
        ;(async () => {
            await pgListener.addChannel('new_emotion')
            return this
        })()
    }

    async create(userId: string, text: string, emoji: string): Promise<Emotion> {
        let em = new Emotion()
        em.userId = userId
        em.text = text
        em.emoji = emoji
        em = await this.emotionRepository.create(em)
        em = await this.emotionRepository.save(em)
        return em
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const result = await this.emotionRepository.delete({ id, userId })
        return result.affected !== 0
    }

    async getEmotion(id: string): Promise<EmotionView> {
        return (await this.pgService.runQuery<EmotionView>(`select * from emotion_view where id = $1`, [id])).rows[0]
    }

    async getEmotions(userId?: string, page = 1, itemPerPage = 10): Promise<PaginatedResponse<EmotionView>> {
        const queryValues: any[] = [(page - 1) * itemPerPage, itemPerPage]
        const whereSections = []
        if (userId) {
            queryValues.push(userId)
            whereSections.push(`"userId" = $${queryValues.length}`)
        }
        const result = (
            await this.pgService.runQuery<{ count: number; items: EmotionView[] }>(
                `
            select
            (SELECT count(id) FROM emotion_view ${
                whereSections.length === 0 ? '' : 'where ' + whereSections.join(' and ')
            }), 
            (select json_agg(r) from 
                (select * from emotion_view ${
                    whereSections.length === 0 ? '' : 'where ' + whereSections.join(' and ')
                } order by "createdAt" DESC offset $1 limit $2) as r
                ) as "items"
            `,
                queryValues,
            )
        ).rows[0]
        return {
            page,
            totalPage: Math.ceil(result.count / itemPerPage),
            totalItems: result.count,
            items: result.items ? result.items : [],
        }
    }

    notifyNewEmotion(): AsyncIterableIterator<EmotionView> {
        return this.pgListener.getChannelIteratorByChannel('new_emotion')
    }
}
