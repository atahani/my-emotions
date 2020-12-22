import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { ThirdPartyAuthenticatorType, UserApp } from '@my-emotions/types'

import { UserAppService } from './userApp.service'

const NEW_DATE_FUNC = new Date('2020-01-01')
const CLEAR_REFRESH_TOKEN_UUID = 'clearRefreshToken'
const HASHED_REFRESH_TOKEN = 'hashedRefreshToken'

jest.mock('uuid', () => ({ v4: () => CLEAR_REFRESH_TOKEN_UUID }))
jest.mock('bcryptjs', () => ({ hash: () => HASHED_REFRESH_TOKEN, compare: () => true }))
jest.spyOn(global, 'Date').mockImplementation(() => (NEW_DATE_FUNC as unknown) as string)

describe('UserApp Service', () => {
    let service: UserAppService
    let repo: Repository<UserApp>
    let userApp: UserApp

    beforeEach(async () => {
        userApp = new UserApp()
        userApp.userId = 'userId'
        userApp.refreshToken = HASHED_REFRESH_TOKEN
        userApp.refreshedAt = NEW_DATE_FUNC
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
        it('should return a user app with refresh token', async () => {
            const repoCreateSpy = jest.spyOn(repo, 'create')
            const repoSaveSpy = jest.spyOn(repo, 'save')
            expect(await service.create('userId', ThirdPartyAuthenticatorType.GOOGLE)).toEqual({
                app: userApp,
                clearRefreshToken: CLEAR_REFRESH_TOKEN_UUID,
            })
            expect(repoCreateSpy).toBeCalledWith(userApp)
            expect(repoSaveSpy).toBeCalledTimes(1)
        })
    })

    describe('getUserIdByRefreshToken', () => {
        it('should return userId with correct id and refresh token', async () => {
            const repoFindOneSpy = jest.spyOn(repo, 'findOne')
            expect(await service.getUserIdByRefreshToken('id', CLEAR_REFRESH_TOKEN_UUID)).toBe(userApp.userId)
            expect(repoFindOneSpy).toBeCalledWith({ id: 'id' })
        })

        it('should return undefined with incorrect id', async () => {
            const repoFindOneSpy = jest.spyOn(repo, 'findOne').mockReturnValue(undefined)
            expect(await service.getUserIdByRefreshToken('badId', CLEAR_REFRESH_TOKEN_UUID)).toBe(undefined)
            expect(repoFindOneSpy).toBeCalledWith({ id: 'badId' })
        })
    })

    describe('refreshIt', () => {
        it('should return clear refresh token', async () => {
            const repoUpdateSpy = jest.spyOn(repo, 'update')
            expect(await service.refreshIt('id', userApp.userId)).toBe(CLEAR_REFRESH_TOKEN_UUID)
            expect(repoUpdateSpy).toBeCalledWith(
                { id: 'id', userId: userApp.userId },
                { refreshToken: HASHED_REFRESH_TOKEN, refreshedAt: NEW_DATE_FUNC },
            )
        })

        it('should return undefined with incorrect id or userId', async () => {
            const repoUpdateSpy = jest.spyOn(repo, 'update').mockResolvedValue({ affected: 0 } as UpdateResult)
            expect(await service.refreshIt('badId', 'badUserId')).toBeUndefined()
            expect(repoUpdateSpy).toBeCalledWith(
                { id: 'badId', userId: 'badUserId' },
                { refreshToken: HASHED_REFRESH_TOKEN, refreshedAt: NEW_DATE_FUNC },
            )
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
