import { Injectable } from '@nestjs/common'
import { IEnv, IEnvConfig } from './env-config.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvConfigService implements IEnvConfig {
  constructor(private readonly configService: ConfigService<IEnv>) {}
  getAppPort(): number {
    return this.configService.get<number>('PORT')!
  }
  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')!
  }
}
