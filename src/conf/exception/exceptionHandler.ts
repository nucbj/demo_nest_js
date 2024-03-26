import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ResponseCodeEnums } from 'src/common/enums/responseCodeEnums';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    if (exception.name === 'NoSuchElement') {
      response.status(status).json({
        code: ResponseCodeEnums.NO_SUCH_ELEMENT,
      });
    } else if (exception.name === 'InvalidParamterException') {
      response.status(status).json({
        code: ResponseCodeEnums.INVALID_PARAMETER,
      });
    } else {
      response.status(status).json({
        code: ResponseCodeEnums.INTERNAL,
      });
    }
  }
}
