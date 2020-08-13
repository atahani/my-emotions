import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserApp, User } from '@my-emotions/types'

import { GooglePassportStrategy } from 'common/service/google.passport.service'
import { PostgresService } from 'common/service/pg.service'
import { RedisService } from 'common/service/redis.service'
import { UserAppService } from 'common/service/userApp.service'
import { UserService } from 'common/service/user.service'

import { AuthController } from './auth.controller'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User, UserApp])],
    controllers: [AuthController],
    providers: [
        UserService,
        GooglePassportStrategy,
        PostgresService,
        AuthService,
        RedisService,
        UserAppService,
        AuthResolver,
    ],
    exports: [
        TypeOrmModule.forFeature([User, UserApp]),
        UserService,
        GooglePassportStrategy,
        PostgresService,
        AuthService,
        RedisService,
        UserAppService,
    ],
})
export class AuthModule {}
