
import { NotFoundError } from '@/shared/errors/not-found-error';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify'

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    response
      .status(404).send({
        statusCode: 404,
        error: exception.name,
        message: exception.message
      })
  }
}
