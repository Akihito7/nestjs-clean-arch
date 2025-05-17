import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest"
import { NotFoundError } from "@/shared/errors/not-found-error";
import { NotFoundErrorFilter } from "../../not-found-error.filter";

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('Stub class NotFoundError');
  }
}

describe('notFoundErrorFilter e2e tests', () => {
  let appModule: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      controllers: [StubController]
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    app.init();
  })

  it('should throw error when entity is not found', async () => {
    const res = await request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'NotFoundError',
      message: 'Stub class NotFoundError'
    })
  })
})