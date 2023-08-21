import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ApplicationLogger } from './application-logger.service';

@Catch()
export class ApplicationLoggerExceptionsFilter extends BaseExceptionFilter {
  constructor(
    protected readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: ApplicationLogger,
  ) {
    super();
  }

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();

    const { status, body } =
      exception instanceof HttpException
        ? { status: exception.getStatus(), body: exception.getResponse() }
        : { status: HttpStatus.INTERNAL_SERVER_ERROR, body: exception };

    this.logger.error(
      this.logger.formatHttp({ request: req, response: { status, body } }),
      'ApplicationLoggerExceptionsFilter',
    );

    super.catch(exception, host);
  }
}
