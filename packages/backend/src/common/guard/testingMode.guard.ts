import { CanActivate } from '@nestjs/common'

export class TestingModeGuard implements CanActivate {
    canActivate(): boolean {
        return process.env.NODE_ENV === 'test'
    }
}
