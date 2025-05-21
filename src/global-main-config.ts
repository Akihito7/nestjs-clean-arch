import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { WrapperDataInterceptor } from "./shared/infrastructure/interceptors/wrapper-data.interceptor";
import { ConflictErrorFilter } from "./shared/infrastructure/exception-filters/conflict-error.filter";
import { NotFoundErrorFilter } from "./shared/infrastructure/exception-filters/not-found-error.filter";
import { InvalidPasswordErrorFilter } from "./shared/infrastructure/exception-filters/invalid-password-error.filter";
import { InvalidCredentialsErrorFilter } from "./shared/infrastructure/exception-filters/invalid-credentials-error.filter";

export async function globalMainConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: 422,
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
  }))
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)
    )
  );
  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new InvalidPasswordErrorFilter(),
    new InvalidCredentialsErrorFilter());
}