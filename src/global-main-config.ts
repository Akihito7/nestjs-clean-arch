import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WrapperDataInterceptor } from "./shared/infrastructure/interceptors/wrapper-data.interceptor";

export async function globalMainConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: 422,
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
  }))
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector))
  );
}