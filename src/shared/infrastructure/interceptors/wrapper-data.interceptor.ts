
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapperDataInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    //here is before response, then this is request;

    return next
      .handle()
      .pipe(map((body) => !body || 'acessToken' in body || 'meta' in body ? body : { data: body }))
  }
}
