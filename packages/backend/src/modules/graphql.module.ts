import { ConfigService } from 'nestjs-config'
import { GraphQLModule } from '@nestjs/graphql'
import { Module } from '@nestjs/common'
import CookieParser from 'cookie-parser'

import { AuthModule } from './auth/auth.module'
import { EmotionModule } from './emotion/emotion.module'
import { UserModule } from './user/user.module'

@Module({
    imports: [
        AuthModule,
        UserModule,
        EmotionModule,
        GraphQLModule.forRootAsync({
            useFactory: (config: ConfigService) => {
                const cookieMiddleware = CookieParser(config.get('app.cookieSecret'))
                return Object.assign(
                    {
                        autoSchemaFile: 'schema.gql',
                        playground: true,
                        introspection: true,
                        installSubscriptionHandlers: true,
                        context: ({ req, res, connection }) => ({ req, res, connection }),
                        subscriptions: {
                            keepAlive: 5000,
                            onConnect: (_, ws: any) => {
                                return new Promise((resolve) =>
                                    cookieMiddleware(ws.upgradeReq, {} as any, () => {
                                        resolve({ req: ws.upgradeReq })
                                    }),
                                )
                            },
                        },
                        cors: { credentials: true, origin: config.get('client.originEndpoints').toString().split(',') },
                    },
                    config.get('graphql'),
                )
            },
            inject: [ConfigService],
        }),
    ],
})
export class GraphqlModuleWithRoot {}
