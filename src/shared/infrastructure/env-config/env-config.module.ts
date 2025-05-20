import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { EnvConfigService } from './env-config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), `.env.${process.env.NODE_ENV}`)],
    }),
  ],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule {}
