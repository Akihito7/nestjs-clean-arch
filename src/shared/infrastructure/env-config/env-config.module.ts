import { Module } from '@nestjs/common'
import { EnvConfigService } from './env-config.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
})
export class EnvConfigModule {}
