import { BaseEntity, Entity, Column, CreateDateColumn, JoinColumn, OneToMany } from 'typeorm'

import { User } from './user.entity'

@Entity('emotion')
export class Emotion extends BaseEntity {
    @Column('uuid', { primary: true, generated: 'uuid' })
    id: string

    @Column('uuid', { name: 'user_id' })
    userId: string

    @Column('text')
    text: string

    @Column('text')
    emoji: string

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date

    @OneToMany(() => User, (user) => user.emotions)
    @JoinColumn({ name: 'user_id' })
    user: User
}
