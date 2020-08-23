import { ConfigService } from 'nestjs-config'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { EmotionModule } from './emotion/emotion.module'

@Module({
    imports: [
        AuthModule,
        EmotionModule,
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
