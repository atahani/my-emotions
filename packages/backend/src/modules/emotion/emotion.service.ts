import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Emotion, EmotionView } from '@my-emotions/types'

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
        const em = new Emotion()
        em.userId = userId
        em.text = text
        em.emoji = emoji
        return await this.emotionRepository.create(em).save()
    }

    async delete(id: string, userId: string): Promise<boolean> {
        const result = await this.emotionRepository.delete({ id, userId })
        return result.affected !== 0
    }

    async getEmotion(id: string): Promise<EmotionView> {
        const result = await this.pgService.runQuery<EmotionView>(
            `select 
          e.id, 
          e.text, 
          json_build_object('id', u.id, 'displayName', u.display_name, 'imageURL', u.image_url) as "userBriefProfileView", 
          e.emoji, 
          e.created_at as "createdAt" 
            from emotion as e join m_user as u 
              on e.user_id = u.id where e.id = $1`,
            [id],
        )
        return result.rows[0]
    }

    async getEmotions(offset = 0, limit = 10): Promise<EmotionView[]> {
        const result = await this.pgService.runQuery<EmotionView>(
            `select 
            e.id, 
            e.text, 
            json_build_object('id', u.id, 'displayName', u.display_name, 'imageURL', u.image_url) as "userBriefProfileView", 
            e.emoji, 
            e.created_at as "createdAt" 
              from emotion as e join m_user as u 
                on e.user_id = u.id 
                  order by e.created_at DESC offset $1 limit $2;`,
            [offset, limit],
        )
        return result.rows
    }

    async getUserEmotions(userId: string, offset = 0, limit = 10): Promise<EmotionView[]> {
        const result = await this.pgService.runQuery<EmotionView>(
            `select 
          e.id, 
          e.text, 
          json_build_object('id', u.id, 'displayName', u.display_name, 'imageURL', u.image_url) as "userBriefProfileView", 
          e.emoji, 
          e.created_at as "createdAt" 
            from emotion as e join m_user as u 
              on e.user_id = u.id 
              where e.user_id = $1
                order by e.created_at DESC offset $2 limit $3;`,
            [userId, offset, limit],
        )
        return result.rows
    }

    notifyNewEmotion(): AsyncIterableIterator<EmotionView> {
        return this.pgListener.getChannelIteratorByChannel('new_emotion')
    }
}
