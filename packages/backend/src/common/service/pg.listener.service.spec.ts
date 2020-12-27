import { ConfigService } from 'nestjs-config'
import { Test, TestingModule } from '@nestjs/testing'

import { PostgresListenerService } from './pg.listener.service'

jest.mock('pg', () => ({
    Pool: jest.fn().mockImplementation(() => ({
        connect: async () => ({
            on: jest.fn(),
            release: jest.fn(),
            query: jest.fn(),
        }),
        end: jest.fn(),
    })),
}))

describe('PostgresListenerService', () => {
    let service: PostgresListenerService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostgresListenerService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: (key: string) => key,
                    },
                },
            ],
        }).compile()

        service = module.get<PostgresListenerService>(PostgresListenerService)
    })

    afterAll(async () => {
        await service.end()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('should be initialized', () => {
        it('should implement on notification and error event', () => {
            const clientOnSpy = jest.spyOn(service['client'], 'on')
            expect(clientOnSpy).toBeCalledTimes(2)
        })
    })

    describe('getChannelIteratorByChannel', () => {
        it('should call events form pgEventEmittery', () => {
            const eventsSpy = jest.spyOn(service['pgEventEmittery'], 'events')
            service.getChannelIteratorByChannel('new_emotion')
            expect(eventsSpy).toBeCalledWith('new_emotion')
        })
    })

    describe('end', () => {
        it('should call client release fn', async () => {
            const releaseSpy = jest.spyOn(service['client'], 'release')
            await service.end()
            expect(releaseSpy).toBeCalledTimes(1)
        })
    })

    describe('addChannel', () => {
        it('should add to the channelList', async () => {
            await service.addChannel('new_emotion')
            expect(service['channelList']).toStrictEqual(['new_emotion'])
        })

        it('should call query fn of client to LISTEN to the new notification on PG', async () => {
            const querySpy = jest.spyOn(service['client'], 'query')
            await service.addChannel('new_emotion')
            expect(querySpy).toBeCalledWith('LISTEN new_emotion')
        })

        it('should emit error while some error happened', async () => {
            jest.spyOn(service['client'], 'query').mockImplementation(() => {
                throw new Error('some error')
            })
            const pgEventEmitteryEmitSpy = jest.spyOn(service['pgEventEmittery'], 'emit')
            expect(await service.addChannel('new_emotion')).toBeUndefined()
            expect(pgEventEmitteryEmitSpy).toBeCalledWith(
                'error',
                new Error('failed to set up new_emotion channel to getting pg notifications.'),
            )
        })
    })

    describe('removeChannel', () => {
        it('should call query fn of client to unlisten to the notification', async () => {
            const querySpy = jest.spyOn(service['client'], 'query')
            await service.removeChannel('new_emotion')
            expect(querySpy).toBeCalledWith('UNLISTEN new_emotion')
        })

        it('should emit error while some error happened', async () => {
            jest.spyOn(service['client'], 'query').mockImplementation(() => {
                throw new Error('some error')
            })
            const pgEventEmitteryEmitSpy = jest.spyOn(service['pgEventEmittery'], 'emit')
            expect(await service.removeChannel('new_emotion')).toBeUndefined()
            expect(pgEventEmitteryEmitSpy).toBeCalledWith(
                'error',
                new Error('failed to stop listening to new_emotion channel.'),
            )
        })
    })

    describe('getEventEmitter', () => {
        it('should return pgEventEmittery', () => {
            expect(service.getEventEmitter()).toBe(service['pgEventEmittery'])
        })
    })
})
