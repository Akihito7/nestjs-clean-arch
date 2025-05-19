import { InvalidPasswordError } from "@/shared/errors/invalid-password-error"
import { Controller, Get, INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import request from 'supertest'
import { InvalidPasswordErrorFilter } from "../../invalid-password-error.filter";

@Controller('stub')
class StubClass {
  @Get()
  index() {
    throw new InvalidPasswordError('Stub Class InvalidPasswordError.');
  }
}

describe('invalidPassworErrorFilter', () => {
  let app: INestApplication;
  let appModule: TestingModule;
  beforeAll(async () => {
    appModule = await Test.createTestingModule({ controllers: [StubClass] }).compile();
    app = appModule.createNestApplication();
    app.useGlobalFilters(new InvalidPasswordErrorFilter());
    app.init();
  })

  it('should throw error with correcly data', async () => {
    await request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'InvalidPasswordError',
      message: 'Stub Class InvalidPasswordError.'
    });
  })
})