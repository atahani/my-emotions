import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, UpdateDateColumn } from 'typeorm'

import { Emotion } from './emotion.entity'
import { UserApp } from './userApp.entity'
import { UserDataProvider } from '../providers'

@Index('m_user_providers_gin_idx', { synchronize: false })
@Entity('m_user')
export class User extends BaseEntity {
    @Column('uuid', { primary: true, generated: 'uuid' })
    id: string

    @Column('text', { name: 'first_name' })
    firstName: string

    @Column('text', { name: 'last_name' })
    lastName: string

    @Column('text', { name: 'display_name' })
    displayName: string

    @Column('text', { name: 'email', unique: true })
    email: string

    @Column('text', { name: 'image_url', nullable: true })
    imageURL?: string

    @Column('jsonb', { nullable: true })
    providers?: UserDataProvider[]

    @Column('boolean', { name: 'is_suspended', default: false })
    isSuspended?: boolean

    @Column({ type: 'timestamptz', name: 'suspended_at', nullable: true })
    suspendedAt?: Date

    @CreateDateColumn({ type: 'timestamptz', name: 'joined_at' })
    joinedAt?: Date

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt?: Date

    @ManyToOne(() => UserApp, (userApp) => userApp.user, {
        onDelete: 'CASCADE',
    })
    userApps: UserApp[]

    @ManyToOne(() => Emotion, (emotion) => emotion.user, {
        onDelete: 'CASCADE',
    })
    emotions: Emotion[]
}
