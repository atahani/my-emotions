import { ConfigModule, ConfigService } from 'nestjs-config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'

import { User, UserApp } from '@my-emotions/types'

const ENV = process.env.NODE_ENV

@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('pg.host'),
                port: config.get('pg.port'),
                username: config.get('pg.username'),
                password: config.get('pg.password'),
                database: config.get('pg.database'),
                entities: [User, UserApp],
                synchronize: true,
                logging: ENV !== 'test',
                dropSchema: ENV === 'test',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class TypeOrmModuleWithRoot {}
