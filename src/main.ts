import { NestFactory, Reflector } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const PORT = process.env.PORT ?? 3000
  await app.listen(PORT, '0.0.0.0', () => console.log(`server running on port ${PORT} `))
}
bootstrap()
