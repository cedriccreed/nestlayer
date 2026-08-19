import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ExceptionBody = {
  message?: string | string[];
  error?: string;
};

// An exception filter is Nest's last stop before a response goes out: it
// catches thrown errors and decides the HTTP body. Controllers stay
// focused on success paths and throw HttpException; this class shapes
// every failure the same way.
//
// Clients (web, mobile, other services) can always read statusCode and
// message instead of branching on Nest's default shape vs a raw string.
// Without this filter, a ValidationPipe 400 is `{ statusCode, message[],
// error }` while a thrown string UnauthorizedException may be just text —
// SDKs and logs become messy.
@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[] = exception.message;
    let error = exception.name;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const body = exceptionResponse as ExceptionBody;
      if (body.message !== undefined) {
        message = body.message;
      }
      if (body.error !== undefined) {
        error = body.error;
      }
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
