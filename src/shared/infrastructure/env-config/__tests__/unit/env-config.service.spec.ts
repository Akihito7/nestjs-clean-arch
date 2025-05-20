import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { join } from 'node:path'
import { EnvConfigService } from '../../env-config.service'

describe('EnvConfigService', () => {
  let SUT: EnvConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [join(process.cwd(), `.env.${process.env.NODE_ENV}`)],
        }),
      ],
      providers: [EnvConfigService],
    }).compile()

    SUT = module.get<EnvConfigService>(EnvConfigService)
  })

  it('should be defined', () => {
    expect(SUT).toBeDefined()
  })

  it('Should get port', () => {
    expect(SUT.getAppPort()).toEqual(3010)
  })

  it('Should be get NODE_ENV', () => {
    expect(SUT.getNodeEnv()).toEqual('test')
  })

  it('Should be get jwt secret', () => {
    expect(SUT.getJwtSecret()).toEqual('xama')
  })

  it('Should be get expires in seconds', () => {
    expect(SUT.getExpiresInSeconds()).toEqual(84600)
  })
})
