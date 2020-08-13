import { BaseEntity, Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ThirdPartyAuthenticatorType } from '../enums'
import { User } from './user.entity'

@ObjectType('UserApp')
@Entity('user_app')
export class UserApp extends BaseEntity {
    @Field(() => ID)
    @Column('uuid', { primary: true, generated: 'uuid' })
    id: string

    @Column({ name: 'user_id' })
    userId: string

    @Column('text', { name: 'refresh_token' })
    refreshToken: string

    @Field()
    @Column('timestamptz', { name: 'refreshed_at' })
    refreshedAt: Date

    @Field()
    @Column('timestamptz', { name: 'authorized_at' })
    authorizedAt: Date

    @Field(() => ThirdPartyAuthenticatorType, { nullable: true })
    @Column('text', { name: 'third_party_authenticator_type', nullable: true })
    thirdPartyAuthenticatorType?: ThirdPartyAuthenticatorType

    @OneToMany(() => User, (user) => user.userApps, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User
}
