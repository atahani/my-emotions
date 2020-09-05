import * as fs from 'fs'
import * as path from 'path'

import { Client, Pool } from 'pg'

import pg from 'config/pg'

const currentPath = path.resolve(process.cwd(), 'sql/')

const clientConfig = {
    host: pg.host,
    password: pg.password,
    port: pg.port,
    user: pg.username,
}

export const getPGClient = (): Client => {
    return new Client(Object.assign({}, clientConfig, { database: pg.database }))
}

export const globalPGPool = new Pool({
    ...clientConfig,
    database: pg.database,
    max: 400,
})

export const createDBIfNotExist = async (databaseName = pg.database): Promise<void> => {
    const client = new Client(clientConfig)

    await client.connect()

    const res = await client.query<{ exists: boolean }>(
        `SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '${databaseName}')`,
    )
    if (!res.rows[0].exists) {
        await client.query(`CREATE DATABASE "${databaseName}"`)
    }
    await client.end()
}

const sqlFiles = [
    'index/m_user_providers_gin_idx.index.sql',
    'func/get_emotion_view_by_id.func.sql',
    'func/notify_new_emotion.func.sql',
    'trigger/notify_new_emotion.trigger.sql',
]

export const runSQLFiles = async (): Promise<void> => {
    const client = getPGClient()
    await client.connect()
    console.warn('START - Run SQL Files')
    for (let i = 0; i < sqlFiles.length; i++) {
        try {
            const sql = fs.readFileSync(path.resolve(currentPath, sqlFiles[i])).toString()
            await client.query(sql)
            console.log(`${sqlFiles[i]} sql file successfully executed.`)
        } catch (err) {
            console.warn(`Something wrong while reading and running ${sqlFiles[i]}\n`, err)
        }
    }
    console.warn('END - Run SQL Files')
    await client.end()
}
