import { ConfigService } from 'nestjs-config'
import { QueryResult } from 'pg'
import { Test, TestingModule } from '@nestjs/testing'

import { PostgresService } from './pg.service'

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

describe('PostgresService', () => {
    let service: PostgresService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostgresService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: (key: string) => key,
                    },
                },
            ],
        }).compile()
        service = module.get<PostgresService>(PostgresService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('runQuery', () => {
        it('should return query result and called query, release of pg client pool', async () => {
            const query = jest.fn().mockImplementation(() => ({ rows: [], rowCount: 0 } as QueryResult))
            const release = jest.fn()
            const connectSpy = jest
                .spyOn(service['pgPool'], 'connect')
                .mockImplementation(async () => ({ query, release }))
            expect(await service.runQuery('select * from user', [])).toStrictEqual({ rows: [], rowCount: 0 })
            expect(connectSpy).toBeCalledTimes(1)
            expect(query).toBeCalledWith('select * from user', [])
            expect(release).toBeCalledTimes(1)
        })
    })
})
