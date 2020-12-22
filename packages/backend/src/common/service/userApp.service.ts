import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'
import * as bcrypt from 'bcryptjs'

import { UserApp, ThirdPartyAuthenticatorType } from '@my-emotions/types'

@Injectable()
export class UserAppService {
    constructor(@InjectRepository(UserApp) private readonly userAppRepository: Repository<UserApp>) {}

    async create(
        userId: string,
        authenticatorType: ThirdPartyAuthenticatorType = null,
    ): Promise<{ app: UserApp; clearRefreshToken: string }> {
        const clearRefreshToken = v4()

        const hashedRefreshToken = await bcrypt.hash(clearRefreshToken, 4)
        let app = new UserApp()
        app.userId = userId
        app.refreshToken = hashedRefreshToken
        app.refreshedAt = new Date()
        app.thirdPartyAuthenticatorType = authenticatorType
        app.authorizedAt = new Date()
        app = await this.userAppRepository.create(app)
        app = await this.userAppRepository.save(app)
        return {
            app,
            clearRefreshToken,
        }
    }

    async getUserIdByRefreshToken(id: string, clearRefreshToken: string): Promise<string | undefined> {
        const app = await this.userAppRepository.findOne({ id })
        if (app && (await bcrypt.compare(clearRefreshToken, app.refreshToken))) {
            return app.userId
        }
        return undefined
    }

    async refreshIt(id: string, userId: string): Promise<string | undefined> {
        const clearRefreshToken = v4()
        const hashedRefreshToken = await bcrypt.hash(clearRefreshToken, 4)
        const result = await this.userAppRepository.update(
            { id, userId },
            {
                refreshToken: hashedRefreshToken,
                refreshedAt: new Date(),
            },
        )
        if (result.affected === 0) {
            return undefined
        }
        return clearRefreshToken
    }

    async getApps(userId: string): Promise<UserApp[]> {
        return await this.userAppRepository.find({ userId })
    }

    async revoke(id: string, userId: string): Promise<boolean> {
        const result = await this.userAppRepository.delete({ id, userId })
        return result.affected !== 0
    }
}
