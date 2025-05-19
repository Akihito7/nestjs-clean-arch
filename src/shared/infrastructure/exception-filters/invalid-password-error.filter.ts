
import { ConflictError } from '@/shared/errors/conflit-error';
import { InvalidPasswordError } from '@/shared/errors/invalid-password-error';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify'

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    response
      .status(400).send({
        statusCode: 400,
        error: exception.name,
        message: exception.message
      })
  }
}
