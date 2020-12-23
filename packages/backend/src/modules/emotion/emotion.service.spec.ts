import { DeleteResult, Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { QueryResult } from 'pg'
import { Test, TestingModule } from '@nestjs/testing'

import { Emotion, EmotionView, PaginatedResponse } from '@my-emotions/types'

import { PostgresListenerService } from 'common/service/pg.listener.service'
import { PostgresService } from 'common/service/pg.service'

import { EmotionService } from './emotion.service'

describe('EmotionService', () => {
    let emotion: Emotion
    let emotionView: EmotionView
    let service: EmotionService
    let repo: Repository<Emotion>
    let pgService: PostgresService
    let pgListener: PostgresListenerService

    beforeAll(() => {
        emotion = new Emotion()
        emotion.userId = 'userId'
        emotion.text = 'emotionText'
        emotion.emoji = 'emotionEmoji'
        emotionView = plainToClass(EmotionView, emotion)
    })

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmotionService,
                {
                    provide: getRepositoryToken(Emotion),
                    useValue: {
                        create: jest.fn().mockResolvedValue(emotion),
                        save: jest.fn().mockResolvedValue(emotion),
                        delete: jest.fn().mockResolvedValue({ affected: 1 } as DeleteResult),
                    },
                },
                {
                    provide: PostgresService,
                    useValue: {
                        runQuery: jest.fn(), // should spy according to the test case
                    },
                },
                {
                    provide: PostgresListenerService,
                    useValue: {
                        addChannel: jest.fn(),
                        getChannelIteratorByChannel: jest.fn().mockReturnValue({
                            [Symbol.asyncIterator]() {
                                return this
                            },
                            next: () => {
                                return emotionView
                            },
                        }),
                    },
                },
            ],
        }).compile()

        service = module.get<EmotionService>(EmotionService)
        repo = module.get<Repository<Emotion>>(getRepositoryToken(Emotion))
        pgService = module.get<PostgresService>(PostgresService)
        pgListener = module.get<PostgresListenerService>(PostgresListenerService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('should return emotion', async () => {
            const createSpy = jest.spyOn(repo, 'create')
            const saveSpy = jest.spyOn(repo, 'save')
            expect(await service.create('userId', 'emotionText', 'emotionEmoji')).toStrictEqual(emotion)
            expect(createSpy).toBeCalledWith(emotion)
            expect(saveSpy).toReturnTimes(1)
        })
    })

    describe('delete', () => {
        it('should return true after deletion', async () => {
            const deleteSpy = jest.spyOn(repo, 'delete')
            expect(await service.delete('id', 'userId')).toBe(true)
            expect(deleteSpy).toBeCalledWith({ id: 'id', userId: 'userId' })
        })
    })

    describe('getEmotion', () => {
        it('should return a emotion view', async () => {
            const runQuerySpy = jest
                .spyOn(pgService, 'runQuery')
                .mockResolvedValue({ rows: [emotionView] } as QueryResult<EmotionView>)
            expect(await service.getEmotion('id')).toStrictEqual(emotionView)
            expect(runQuerySpy).toBeCalledWith(`select * from emotion_view where id = $1`, ['id'])
        })
    })

    describe('getEmotions', () => {
        it('should return emotions in pagination format', async () => {
            const runQuerySpy = jest
                .spyOn(pgService, 'runQuery')
                .mockResolvedValue({ rows: [{ count: 2, items: [emotionView, emotionView] }] } as QueryResult<{
                    count: number
                    items: EmotionView[]
                }>)
            expect(await service.getEmotions('userId', 1, 5)).toStrictEqual({
                page: 1,
                totalPage: 1,
                totalItems: 2,
                items: [emotionView, emotionView],
            } as PaginatedResponse<EmotionView>)
            expect(runQuerySpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('notifyNewEmotion', () => {
        it('should return a AsyncIterableIterator of the EmotionView', () => {
            const getChannelIteratorByChannelSpy = jest.spyOn(pgListener, 'getChannelIteratorByChannel')
            expect(service.notifyNewEmotion().next()).toStrictEqual(emotionView)
            expect(getChannelIteratorByChannelSpy).toBeCalledWith('new_emotion')
        })
    })
})
