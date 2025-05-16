import { NestFactory, Reflector } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor } from '@nestjs/common'
import { globalMainConfig } from './global-main-config'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  await globalMainConfig(app)
  const PORT = process.env.PORT ?? 3000
  await app.listen(PORT, '0.0.0.0', () => console.log(`server running on port ${PORT} `))
}
bootstrap()
