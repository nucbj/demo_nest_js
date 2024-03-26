import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CodeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.method === 'GET' && request.query.code) {
      let codeStr = String(request.query.code);
      codeStr = codeStr.replace(/00000$/, '');
      request.query.code = codeStr;
    }
    return next.handle();
  }
}
