import { getRepositoryToken } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { QueryResult } from 'pg'
import { Repository } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { PassportUserData, ThirdPartyAuthenticatorType, User, UserProfileView } from '@my-emotions/types'

import { PostgresService } from './pg.service'
import { UserService } from './user.service'

const googlePassportUserData: PassportUserData = {
    id: 'googleId',
    thirdPartyAuthenticatorType: ThirdPartyAuthenticatorType.GOOGLE,
    firstName: 'fistName',
    lastName: 'lastName',
    displayName: 'displayName',
    email: 'email@mail.com',
    imageURL: 'imageURL',
    accessToken: 'accessToken',
}

describe('User Service', () => {
    let service: UserService
    let repo: Repository<User>
    let pgService: PostgresService
    let user: User

    beforeEach(async () => {
        user = new User()
        user.firstName = googlePassportUserData.firstName
        user.lastName = googlePassportUserData.lastName
        user.displayName = googlePassportUserData.displayName
        user.email = googlePassportUserData.email
        user.imageURL = googlePassportUserData.imageURL
        user.providers = [
            {
                id: googlePassportUserData.id,
                providerType: googlePassportUserData.thirdPartyAuthenticatorType,
            },
        ]
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn().mockResolvedValue(user),
                        save: jest.fn().mockResolvedValue(user),
                        findOne: jest.fn().mockResolvedValue(user),
                    },
                },
                {
                    provide: PostgresService,
                    useFactory: () => ({
                        runQuery: jest.fn().mockResolvedValue({ rows: [user] } as QueryResult<User>),
                    }),
                },
            ],
        }).compile()

        service = module.get<UserService>(UserService)
        repo = module.get<Repository<User>>(getRepositoryToken(User))
        pgService = module.get<PostgresService>(PostgresService)
    })

    describe('registerByPassport', () => {
        it('should return the new user which is registered', async () => {
            const repoCreateSpy = jest.spyOn(repo, 'create')
            const repoSaveSpy = jest.spyOn(repo, 'save')
            expect(await service.registerByPassport(googlePassportUserData)).toBe(user)
            expect(repoCreateSpy).toBeCalledWith(user)
            expect(repoSaveSpy).toReturnTimes(1)
        })
    })

    describe('getUserByProvider', () => {
        it('should return user by user provider', async () => {
            const pgServiceSpy = jest.spyOn(pgService, 'runQuery')
            expect(await service.getUserByProvider(user.providers[0])).toBe(user)
            expect(pgServiceSpy).toBeCalledWith('SELECT * FROM m_user where providers @> $1 limit 1', [
                JSON.stringify([user.providers[0]]),
            ])
        })
    })

    describe('getUserProfileViewById', () => {
        it('should return user profile view', async () => {
            const repoFindOneSpy = jest.spyOn(repo, 'findOne')
            expect(await service.getUserProfileViewById('id')).toStrictEqual(plainToClass(UserProfileView, user))
            expect(repoFindOneSpy).toBeCalledWith({ id: 'id' })
        })

        it('should return undefined with incorrect user id', async () => {
            const repoFindOneSpy = jest.spyOn(repo, 'findOne').mockResolvedValue(undefined)
            expect(await service.getUserProfileViewById('badId')).toBeUndefined()
            expect(repoFindOneSpy).toBeCalledWith({ id: 'badId' })
        })
    })
})
