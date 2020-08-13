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
        app = await this.userAppRepository.create(app).save()
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

    async refreshIt(id: string, userId: string): Promise<string> {
        const clearRefreshToken = v4()
        const hashedRefreshToken = await bcrypt.hash(clearRefreshToken, 4)
        await this.userAppRepository.update(
            { id, userId },
            {
                refreshToken: hashedRefreshToken,
                refreshedAt: new Date(),
            },
        )
        return clearRefreshToken
    }
}
