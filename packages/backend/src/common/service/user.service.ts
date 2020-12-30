import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository } from 'typeorm'

import { User, PassportUserData, UserDataProvider, UserProfileView } from '@my-emotions/types'

import { PostgresService } from './pg.service'

export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly pgService: PostgresService,
    ) {}

    async registerByPassport(data: PassportUserData): Promise<User> {
        let u = new User()
        u.firstName = data.firstName
        u.lastName = data.lastName
        u.displayName = data.displayName
        u.email = data.email
        u.imageURL = data.imageURL
        u.providers = [
            {
                id: data.id,
                providerType: data.thirdPartyAuthenticatorType,
            },
        ]
        u = await this.userRepository.create(u)
        u = await this.userRepository.save(u)
        return u
    }

    async getUserByProvider(dataProvider: UserDataProvider): Promise<User> {
        const result = await this.pgService.runQuery<User>('SELECT * FROM m_user where providers @> $1 limit 1', [
            JSON.stringify([dataProvider]),
        ])
        return result.rows[0]
    }

    async getUserProfileViewById(id: string): Promise<UserProfileView> {
        const user = await this.userRepository.findOne({ id })
        return plainToClass(UserProfileView, user)
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({ email })
    }
}
