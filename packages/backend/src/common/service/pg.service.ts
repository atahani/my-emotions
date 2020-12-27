import { Injectable } from '@nestjs/common'
import { Pool, QueryConfig, QueryResult, QueryResultRow } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

import { ConfigService, InjectConfig } from 'nestjs-config'

const sqlFiles = [
    'index/m_user_providers_gin_idx.index.sql',
    'view/emotion_view.view.sql',
    'func/notify_new_emotion.func.sql',
    'trigger/notify_new_emotion.trigger.sql',
]

const currentPath = path.resolve(process.cwd(), 'sql/')
@Injectable()
export class PostgresService {
    private pgPool: Pool
    constructor(@InjectConfig() config: ConfigService) {
        this.pgPool = new Pool({
            host: config.get('pg.host'),
            password: config.get('pg.password'),
            user: config.get('pg.username'),
            port: config.get('pg.port'),
            database: config.get('pg.database'),
            max: 400,
        })
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

    async runSQLFiles(): Promise<void> {
        for (let i = 0; i < sqlFiles.length; i++) {
            try {
                const sql = fs.readFileSync(path.resolve(currentPath, sqlFiles[i])).toString()
                await this.runQuery(sql)
            } catch (err) {
                console.warn(`Something wrong while reading and running ${sqlFiles[i]}\n`, err)
            }
        }
    }

    async end(): Promise<void> {
        return await this.pgPool.end()
    }
}
