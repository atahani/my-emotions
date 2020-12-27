import { Injectable } from '@nestjs/common'
import { Pool, PoolClient, QueryResult } from 'pg'
import Emittery from 'emittery'

import { ConfigService, InjectConfig } from 'nestjs-config'

@Injectable()
export class PostgresListenerService {
    private readonly pgEventEmittery: Emittery = new Emittery()
    private client: PoolClient
    private pgPool: Pool
    private channelList: string[] = []

    constructor(@InjectConfig() config: ConfigService) {
        this.pgPool = new Pool({
            host: config.get('pg.host'),
            password: config.get('pg.password'),
            user: config.get('pg.username'),
            port: config.get('pg.port'),
            database: config.get('pg.database'),
            max: 400,
        })
        ;(async () => {
            await this.initialized()
            return this
        })()
    }

    private async initialized() {
        this.client = await this.pgPool.connect()
        this.client.on('notification', (message) => {
            const payload = JSON.parse(message.payload)
            this.pgEventEmittery.emit(message.channel, payload)
        })
        this.client.on('error', async () => {
            await Promise.all(this.channelList.map((channel) => this.addChannel(channel)))
        })
    }

    getChannelIteratorByChannel<T>(name: string): AsyncIterableIterator<T> {
        return this.pgEventEmittery.events(name) as AsyncIterableIterator<T>
    }

    async end() {
        await this.client.release()
        await this.pgPool.end()
    }

    async addChannel(name: string): Promise<QueryResult> {
        if (this.channelList.indexOf(name) === -1) {
            this.channelList.push(name)
        }
        try {
            return await this.client.query('LISTEN $1', [name])
        } catch (error) {
            this.pgEventEmittery.emit(
                'error',
                new Error(`failed to set up ${name} channel to getting pg notifications.`),
            )
        }
    }

    async removeChannel(name: string): Promise<QueryResult> {
        const index = this.channelList.indexOf(name)
        if (index !== -1) {
            this.channelList.slice(index, 1)
        }
        try {
            return await this.client.query(`UNLISTEN $1`, [name])
        } catch (error) {
            this.pgEventEmittery.emit('error', new Error(`failed to stop listening to ${name} channel.`))
        }
    }

    getEventEmitter(): Emittery {
        return this.pgEventEmittery
    }
}
