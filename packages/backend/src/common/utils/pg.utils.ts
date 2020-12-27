import { Client } from 'pg'

import pg from 'config/pg'
import { TESTING_DATABASE_NAME } from 'common/constants'

const clientConfig = {
    host: pg.host,
    password: pg.password,
    port: pg.port,
    user: pg.username,
}

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

export const dropIfExistAndCreateDBInTestingMode = async (
    databaseName: string = TESTING_DATABASE_NAME,
): Promise<void> => {
    const client = new Client(clientConfig)

    await client.connect()

    const res = await client.query<{ exists: boolean }>(
        `SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '${databaseName}')`,
    )
    if (res.rows[0].exists) {
        await client.query(`DROP DATABASE "${databaseName}"`)
        await client.query(`CREATE DATABASE "${databaseName}"`)
    } else {
        await client.query(`CREATE DATABASE "${databaseName}"`)
    }
    await client.end()
}
