import { Controller, Get, INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest'
import { InvalidPasswordErrorFilter } from "../../invalid-password-error.filter";
import { InvalidCredentialsError } from "@/shared/errors/invalid-credentials-error";
import { InvalidCredentialsErrorFilter } from "../../invalid-credentials-error.filter";

@Controller('stub')
class StubClass {
  @Get()
  index() {
    throw new InvalidCredentialsError('Stub Class InvalidCredentialsError.');
  }
}

describe('invalidCredentialsErrorFilter e2e tests', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  beforeAll(async () => {
    appModule = await Test.createTestingModule({ controllers: [StubClass] }).compile();
    app = appModule.createNestApplication();
    app.useGlobalFilters(new InvalidCredentialsErrorFilter());
    app.init();
  })

  it('should throw error with correcly data', async () => {
    await request(app.getHttpServer()).get('/stub').expect(401).expect({
      statusCode: 401,
      error: 'InvalidCredentialsError',
      message: 'Stub Class InvalidCredentialsError.'
    });
  })
})