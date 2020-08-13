import { ConfigService } from 'nestjs-config'
import { createDBIfNotExist, runSQLFiles } from 'common/utils'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import CookieParser from 'cookie-parser'

import { AppModule } from 'modules'

async function bootstrap() {
    await createDBIfNotExist()
    await runSQLFiles()
    const app = await NestFactory.create(AppModule)
    const config = app.get(ConfigService)

    app.use(CookieParser(config.get('app.cookieSecret')))

    app.useGlobalPipes(new ValidationPipe())

    await app.listen(config.get('app.port'), () => {
        console.warn(`The Global is available on ${config.get('app.graphqlEndpoint')}`)
    })
}

bootstrap()
