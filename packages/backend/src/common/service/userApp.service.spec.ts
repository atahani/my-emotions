import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { ThirdPartyAuthenticatorType, UserApp } from '@my-emotions/types'

import { UserAppService } from './userApp.service'

const NEW_DATE_FUNC = new Date('2020-01-01')
const HASHED_TOKEN = 'hashedToken'
const RANDOM_CHAR_AS_ACCESS_TOKEN = 'someRandomCharacterInStringAsAccessToken'

jest.mock('common/utils', () => ({ generateRandomString: () => RANDOM_CHAR_AS_ACCESS_TOKEN }))
jest.mock('bcryptjs', () => ({ hash: () => HASHED_TOKEN, compare: () => true }))
jest.spyOn(global, 'Date').mockImplementation(() => (NEW_DATE_FUNC as unknown) as string)

describe('UserApp Service', () => {
    let service: UserAppService
    let repo: Repository<UserApp>
    let userApp: UserApp

    beforeEach(async () => {
        userApp = new UserApp()
        userApp.userId = 'userId'
        userApp.token = HASHED_TOKEN
        userApp.thirdPartyAuthenticatorType = ThirdPartyAuthenticatorType.GOOGLE
        userApp.authorizedAt = NEW_DATE_FUNC

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserAppService,
                {
                    provide: getRepositoryToken(UserApp),

                    useValue: {
                        create: jest.fn().mockResolvedValue(userApp),
                        save: jest.fn().mockResolvedValue(userApp),
                        findOne: jest.fn().mockResolvedValue(userApp),
                        update: jest.fn().mockResolvedValue({ affected: 1 } as UpdateResult),
                        find: jest.fn().mockResolvedValue([userApp]),
                        delete: jest.fn().mockResolvedValue({ affected: 1 } as DeleteResult),
                    },
                },
            ],
        }).compile()

        service = module.get<UserAppService>(UserAppService)
        repo = module.get<Repository<UserApp>>(getRepositoryToken(UserApp))
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('should return a user app with token', async () => {
            const repoCreateSpy = jest.spyOn(repo, 'create')
            const repoSaveSpy = jest.spyOn(repo, 'save')
            expect(await service.create('userId', ThirdPartyAuthenticatorType.GOOGLE)).toEqual({
                app: userApp,
                clearToken: RANDOM_CHAR_AS_ACCESS_TOKEN,
            })
            expect(repoCreateSpy).toBeCalledWith(userApp)
            expect(repoSaveSpy).toBeCalledTimes(1)
        })
    })

    describe('getUserIdByToken', () => {
        it('should return userId with correct id and token', async () => {
            const repoFindOneSpy = jest.spyOn(repo, 'findOne')
            expect(await service.getUserIdByToken('id', RANDOM_CHAR_AS_ACCESS_TOKEN)).toBe(userApp.userId)
            expect(repoFindOneSpy).toBeCalledWith({ id: 'id' })
        })

        it('should return undefined with incorrect id', async () => {
            const repoFindOneSpy = jest.spyOn(repo, 'findOne').mockReturnValue(undefined)
            expect(await service.getUserIdByToken('badId', RANDOM_CHAR_AS_ACCESS_TOKEN)).toBe(undefined)
            expect(repoFindOneSpy).toBeCalledWith({ id: 'badId' })
        })
    })

    describe('getApps', () => {
        it('should return list of apps by user id', async () => {
            const repoFindSpy = jest.spyOn(repo, 'find')
            expect(await service.getApps(userApp.userId)).toStrictEqual([userApp])
            expect(repoFindSpy).toBeCalledWith({ userId: userApp.userId })
        })
    })

    describe('revoke', () => {
        it('should return true with correct user id and app id', async () => {
            const repoDeleteSpy = jest.spyOn(repo, 'delete')
            expect(await service.revoke('id', userApp.userId)).toBeTruthy()
            expect(repoDeleteSpy).toBeCalledWith({ id: 'id', userId: 'userId' })
        })
        it('should return false with incorrect user id or app id', async () => {
            const repoDeleteSpy = jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0 } as DeleteResult)
            expect(await service.revoke('badId', 'badUserId')).toBeFalsy()
            expect(repoDeleteSpy).toBeCalledWith({ id: 'badId', userId: 'badUserId' })
        })
    })
})
