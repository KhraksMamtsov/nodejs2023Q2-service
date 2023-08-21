import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ApplicationLogger } from './logger/application-logger.service';

@Catch()
export class ApplicationExceptionsFilter implements ExceptionFilter {
  constructor(
    protected readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: ApplicationLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>();

    const { status, message } =
      exception instanceof HttpException
        ? { status: exception.getStatus(), message: exception.message }
        : { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Server error' };

    const responseBody = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.logger.error(
      this.logger.formatHttp({
        request: req,
        response: { status: responseBody.statusCode, body: responseBody },
        exception,
      }),
      'ApplicationExceptionsFilter',
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
