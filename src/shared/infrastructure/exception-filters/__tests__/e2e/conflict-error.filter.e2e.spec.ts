import { ConflictError } from "@/shared/errors/conflit-error";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest"
import { ConflictErrorFilter } from "../../conflict-error.filter";

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new ConflictError('Stub class conflicting error.');
  }
}

describe('conflictErrorFilter', () => {
  let appModule: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      controllers: [StubController]
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalFilters(new ConflictErrorFilter());
    app.init();
  })

  it('should throw error with correclty data', async () => {
    const res = await request(app.getHttpServer()).get('/stub').expect(409);
    expect(res.body.error).toStrictEqual('ConflictError')
    expect(res.body.message).toStrictEqual('Stub class conflicting error.')
  })
})