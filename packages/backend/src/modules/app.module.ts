import { APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from 'nestjs-config'
import { Module, HttpException } from '@nestjs/common'
import { RavenModule, RavenInterceptor } from 'nest-raven'
import * as path from 'path'

import { GraphqlModuleWithRoot } from './graphql.module'
import { TypeOrmModuleWithRoot } from './typeorm.module'

@Module({
    imports: [
        RavenModule,
        ConfigModule.load(path.resolve(__dirname, '../config', '**/!(*.d).{ts,js}')),
        GraphqlModuleWithRoot,
        TypeOrmModuleWithRoot,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useValue: new RavenInterceptor({
                filters: [
                    // Filter exceptions of type HttpException. Ignore those that
                    // have status code of less than 500
                    { type: HttpException, filter: (exception: HttpException) => 400 > exception.getStatus() },
                ],
            }),
        },
    ],
})
export class AppModule {}
