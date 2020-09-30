import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '@my-emotions/types'

import { UserService } from 'common/service/user.service'

import { UserResolver } from './user.resolver'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserResolver],
})
export class UserModule {}
