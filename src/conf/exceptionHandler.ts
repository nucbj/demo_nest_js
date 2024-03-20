import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      details: `exception: ${exception.name}, message: ${exception.message}`,
      path: request.url,
    });
  }
}
