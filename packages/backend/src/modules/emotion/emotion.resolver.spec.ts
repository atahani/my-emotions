import { CanActivate, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { ActionStatus, EmotionView, PaginatedResponse, UserBriefProfileView } from '@my-emotions/types'

import { EmotionAuthGuard } from 'common/guard'

import { EmotionResolver } from './emotion.resolver'
import { EmotionService } from './emotion.service'

describe('EmotionResolver', () => {
    let resolver: EmotionResolver
    let service: EmotionService
    let emotion: EmotionView

    beforeEach(async () => {
        emotion = new EmotionView()
        emotion.id = 'id'
        emotion.text = 'emotionText'
        emotion.emoji = 'emotionEmoji'
        emotion.createdAt = new Date('2020-01-01')
        emotion.userBriefProfileView = {
            id: 'userId',
            displayName: 'displayName',
            imageURL: 'imageURL',
        } as UserBriefProfileView
        const mockEmotionAuthGuard: CanActivate = { canActivate: jest.fn(() => true) }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmotionResolver,
                {
                    provide: EmotionService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(emotion),
                        getEmotion: jest.fn().mockResolvedValue(emotion),
                        delete: jest.fn().mockResolvedValue(true),
                        getEmotions: jest.fn().mockResolvedValue({
                            page: 1,
                            totalPage: 1,
                            totalItems: 2,
                            items: [emotion, emotion],
                        } as PaginatedResponse<EmotionView>),
                        notifyNewEmotion: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(EmotionAuthGuard)
            .useValue(mockEmotionAuthGuard)
            .compile()

        resolver = module.get<EmotionResolver>(EmotionResolver)
        service = module.get<EmotionService>(EmotionService)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })

    describe('releaseEmotion', () => {
        it('should create and return emotion view', async () => {
            const createSpy = jest.spyOn(service, 'create')
            expect(
                await resolver.releaseEmotion('userId', { text: 'emotionText', emoji: 'emotionEmoji' }),
            ).toStrictEqual(emotion)
            expect(createSpy).toBeCalledWith('userId', 'emotionText', 'emotionEmoji')
        })
    })

    describe('forgotEmotion', () => {
        it('should return action status when have a emotion to forgot', async () => {
            const deleteSpy = jest.spyOn(service, 'delete')
            expect(await resolver.forgotEmotion('userId', 'id')).toStrictEqual(
                new ActionStatus(`Be sure; I've forgotten this emotion.`),
            )
            expect(deleteSpy).toBeCalledWith('id', 'userId')
        })

        it('should get not found exception', async () => {
            jest.spyOn(service, 'delete').mockResolvedValue(false)
            try {
                await resolver.forgotEmotion('userId', 'id')
            } catch (error) {
                expect(error).toStrictEqual(new NotFoundException(`can't find any emotion with this id`))
            }
        })
    })

    describe('emotions', () => {
        it('should return paginated emotion view', async () => {
            const getEmotionSpy = jest.spyOn(service, 'getEmotions')
            expect(await resolver.emotions(undefined, 1, 10)).toStrictEqual({
                page: 1,
                totalPage: 1,
                totalItems: 2,
                items: [emotion, emotion],
            } as PaginatedResponse<EmotionView>)
            expect(getEmotionSpy).toBeCalledWith(undefined, 1, 10)
        })
    })

    describe('emotion', () => {
        it('should return emotion view by id', async () => {
            const getEmotionSpy = jest.spyOn(service, 'getEmotion')
            expect(await resolver.emotion('id')).toStrictEqual(emotion)
            expect(getEmotionSpy).toBeCalledWith('id')
        })

        it('should get a not found exception error', async () => {
            jest.spyOn(service, 'getEmotion').mockResolvedValue(undefined)
            try {
                await service.getEmotion('id')
            } catch (error) {
                expect(error).toStrictEqual(new NotFoundException(`can't find any emotion with this id`))
            }
        })
    })

    describe('newEmotion', () => {
        it('should call notifyNewEmotion as well', () => {
            const notifyNewEmotionSpy = jest.spyOn(service, 'notifyNewEmotion')
            service.notifyNewEmotion()
            expect(notifyNewEmotionSpy).toBeCalledTimes(1)
        })
    })
})
