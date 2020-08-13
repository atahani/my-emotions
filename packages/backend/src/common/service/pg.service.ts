import { Injectable } from '@nestjs/common'
import { Pool, QueryConfig, QueryResult, QueryResultRow } from 'pg'

import { globalPGPool } from 'common/utils'

@Injectable()
export class PostgresService {
    private pgPool: Pool
    constructor() {
        this.pgPool = globalPGPool
    }

    async runQuery<T extends QueryResultRow = any, I extends any[] = any[]>(
        queryTextOrConfig: string | QueryConfig<I>,
        values?: I,
    ): Promise<QueryResult<T>> {
        const client = await this.pgPool.connect()
        try {
            return await client.query<T>(queryTextOrConfig, values)
        } catch (error) {
            throw error
        } finally {
            client.release()
        }
    }
}
