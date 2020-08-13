import { ConfigModule } from 'nestjs-config'
import { Module } from '@nestjs/common'
import * as path from 'path'

import { GraphqlModuleWithRoot } from './graphql.module'
import { TypeOrmModuleWithRoot } from './typeorm.module'

@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
        GraphqlModuleWithRoot,
        TypeOrmModuleWithRoot,
    ],
})
export class AppModule {}
