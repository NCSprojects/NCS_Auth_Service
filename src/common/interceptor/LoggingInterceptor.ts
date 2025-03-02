import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    // 요청 정보를 가져오기
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.log(`Request started: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const timeTaken = Date.now() - now;
        this.logger.log(`Request completed: ${method} ${url} (${timeTaken}ms)`);
      }),
    );
  }
}
