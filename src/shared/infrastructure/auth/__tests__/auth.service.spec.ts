import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { JwtModule } from "@nestjs/jwt";
import { EnvConfigModule } from "../../env-config/env-config.module";
import { ConfigModule } from "@nestjs/config";
import { EnvConfigService } from "../../env-config/env-config.service";

describe('AuthService unit tests', () => {

  let SUT: AuthService;

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.registerAsync({
        imports: [EnvConfigModule],
        useFactory: async (configService: EnvConfigService) => ({
          global: true,
          secret: configService.getJwtSecret(),
          signOptions: { expiresIn: configService.getExpiresInSeconds() },
        }),
        inject: [EnvConfigService],
      }), EnvConfigModule, ConfigModule],
      providers: [AuthService]
    }).compile();

    SUT = module.get<AuthService>(AuthService);

  });

  it('should create a token jwt', async () => {
    const { acessToken } = SUT.generateToken('fakeID');
    expect(typeof acessToken).toEqual('string')
    expect(acessToken).toBeDefined();
  })

  it('should verify token', async () => {
    const { acessToken } = SUT.generateToken('fakeID');
    const isValidToken = await SUT.verifyJwt(acessToken);
    expect(isValidToken).toBeTruthy();
  })

})