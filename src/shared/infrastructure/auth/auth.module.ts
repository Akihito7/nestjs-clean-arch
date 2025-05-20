import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvConfigService } from '../env-config/env-config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory(configService: EnvConfigService) {
        return {
          secret: configService.getJwtSecret(),
          signOptions: {
            expiresIn: configService.getExpiresInSeconds(),
          },
        }
      },
      inject: [EnvConfigService]
    })
  ],
  providers: [AuthService]
})
export class AuthModule { }
