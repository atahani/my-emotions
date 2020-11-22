import { ConfigService } from 'nestjs-config'
import { createDBIfNotExist, runSQLFiles } from 'common/utils'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as Sentry from '@sentry/node'
import CookieParser from 'cookie-parser'

import { AppModule } from 'modules'

async function bootstrap() {
    await createDBIfNotExist()
    await runSQLFiles()
    const app = await NestFactory.create(AppModule)
    const config = app.get(ConfigService)

    Sentry.init({
        dsn: config.get('sentry.dsn'),
        debug: config.get('sentry.debug'),
        logLevel: config.get('sentry.logLevel'),
        environment: config.get('app.environment'),
    })

    app.use(CookieParser(config.get('app.cookieSecret')))
    app.enableCors({ credentials: true, origin: config.get('client.originEndpoints').toString().split(',') })

    app.useGlobalPipes(new ValidationPipe())

    await app.init()

    await app.listen(config.get('app.port'), () => {
        console.warn(`The Global is available on ${config.get('app.graphqlEndpoint')}`)
    })
}

bootstrap()
