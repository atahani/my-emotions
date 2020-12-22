import { InjectConfig, ConfigService } from 'nestjs-config'
import IORedis, { Ok } from 'ioredis'

export class RedisService {
    private readonly USER_PREFIX = 'user'
    private readonly tokenExpiresInMin: number
    private readonly redis: IORedis.Redis
    constructor(@InjectConfig() config: ConfigService) {
        this.redis = new IORedis(config.get('redis.port'), config.get('redis.host'), {
            password: config.get('redis.password'),
            lazyConnect: true,
        })
        this.tokenExpiresInMin = config.get('auth.tokenExpiresInMin')
    }

    private _accessTokenKey(appId: string, token: string): string {
        return `${this.USER_PREFIX}:${appId}:access_token:${token}`
    }

    async setUserToken(appId: string, userId: string, token: string): Promise<Ok> {
        return await this.redis.set(this._accessTokenKey(appId, token), userId, 'ex', 60 * this.tokenExpiresInMin)
    }

    async getUserId(appId: string, token: string): Promise<string | undefined> {
        return await this.redis.get(this._accessTokenKey(appId, token))
    }
}
