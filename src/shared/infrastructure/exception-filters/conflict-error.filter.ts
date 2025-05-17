
import { ConflictError } from '@/shared/errors/conflit-error';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify'

@Catch(ConflictError)
export class ConflictErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    response
      .status(409).send({
        statusCode: 409,
        error: exception.name,
        message: exception.message
      })
  }
}
