import { ConfigService } from 'nestjs-config'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        AuthModule,
        GraphQLModule.forRootAsync({
            useFactory: (config: ConfigService) =>
                Object.assign(
                    {
                        autoSchemaFile: 'schema.gql',
                        playground: true,
                        context: ({ req, res }) => ({ req, res }),
                    },
                    config.get('graphql'),
                ),
            inject: [ConfigService],
        }),
    ],
})
export class GraphqlModuleWithRoot {}
