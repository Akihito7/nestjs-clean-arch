
import { ConflictError } from '@/shared/errors/conflit-error';
import { InvalidCredentialsError } from '@/shared/errors/invalid-credentials-error';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify'

@Catch(InvalidCredentialsError)
export class InvalidCredentialsErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    response
      .status(401).send({
        statusCode: 401,
        error: exception.name,
        message: exception.message
      })
  }
}
