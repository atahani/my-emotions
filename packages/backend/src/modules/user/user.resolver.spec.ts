import { CanActivate, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { UserProfileView } from '@my-emotions/types'

import { EmotionAuthGuard } from 'common/guard'
import { UserService } from 'common/service/user.service'

import { UserResolver } from './user.resolver'

describe('UserResolver', () => {
    let resolver: UserResolver
    let userService: UserService
    let userProfileView: UserProfileView

    beforeEach(async () => {
        userProfileView = new UserProfileView()
        userProfileView.id = 'userId'
        userProfileView.firstName = 'firstName'
        userProfileView.lastName = 'lastName'
        userProfileView.displayName = 'displayName'
        userProfileView.imageURL = 'imageURL'
        userProfileView.email = 'email@mail.com'
        const mockEmotionAuthGuard: CanActivate = { canActivate: jest.fn(() => true) }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                {
                    provide: UserService,
                    useValue: {
                        getUserProfileViewById: jest.fn().mockResolvedValue(userProfileView),
                    },
                },
            ],
        })
            .overrideGuard(EmotionAuthGuard)
            .useValue(mockEmotionAuthGuard)
            .compile()

        resolver = module.get<UserResolver>(UserResolver)
        userService = module.get<UserService>(UserService)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })

    describe('myProfile', () => {
        it('should return his/her profile view', async () => {
            const getUserProfileSpy = jest.spyOn(userService, 'getUserProfileViewById')
            expect(await resolver.myProfile('userId')).toStrictEqual(userProfileView)
            expect(getUserProfileSpy).toBeCalledWith('userId')
        })
    })

    describe('profile', () => {
        it('should return user profile based on userId arg', async () => {
            const getUserProfileSpy = jest.spyOn(userService, 'getUserProfileViewById')
            expect(await resolver.profile('userId')).toStrictEqual(userProfileView)
            expect(getUserProfileSpy).toBeCalledWith('userId')
        })

        it('should get not found exception', async () => {
            jest.spyOn(userService, 'getUserProfileViewById').mockResolvedValue(undefined)
            try {
                await resolver.profile('userId')
            } catch (error) {
                expect(error).toStrictEqual(new NotFoundException(`can't found any user profile with this id`))
            }
        })
    })
})
