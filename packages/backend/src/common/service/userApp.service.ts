import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { UserApp, ThirdPartyAuthenticatorType } from '@my-emotions/types'

import { generateRandomString } from 'common/utils'

@Injectable()
export class UserAppService {
    constructor(@InjectRepository(UserApp) private readonly userAppRepository: Repository<UserApp>) {}

    async create(
        userId: string,
        authenticatorType: ThirdPartyAuthenticatorType = null,
    ): Promise<{ app: UserApp; clearToken: string }> {
        const clearToken = generateRandomString(18)

        const hashedToken = await bcrypt.hash(clearToken, 4)
        let app = new UserApp()
        app.userId = userId
        app.token = hashedToken
        app.thirdPartyAuthenticatorType = authenticatorType
        app.authorizedAt = new Date()
        app = await this.userAppRepository.create(app)
        app = await this.userAppRepository.save(app)
        return {
            app,
            clearToken,
        }
    }

    async getUserIdByToken(id: string, clearToken: string): Promise<string | undefined> {
        const app = await this.userAppRepository.findOne({ id })
        if (app && (await bcrypt.compare(clearToken, app.token))) {
            return app.userId
        }
        return undefined
    }

    async getApps(userId: string): Promise<UserApp[]> {
        return await this.userAppRepository.find({ userId })
    }

    async revoke(id: string, userId: string): Promise<boolean> {
        const result = await this.userAppRepository.delete({ id, userId })
        return result.affected !== 0
    }
}
