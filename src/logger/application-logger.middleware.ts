import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApplicationLogger } from './application-logger.service';

@Injectable()
export class ApplicationLoggerMiddleware implements NestMiddleware {
  constructor(private logger: ApplicationLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];

    res.write = function (chunk: any) {
      chunks.push(chunk);
      // eslint-disable-next-line prefer-rest-params
      return oldWrite.apply(res, arguments);
    };
    res.end = function (chunk: any) {
      if (chunk) {
        chunks.push(chunk);
      }
      // eslint-disable-next-line prefer-rest-params
      return oldEnd.apply(res, arguments);
    };

    res.once('finish', () => {
      const responseBody = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      this.logger.verbose(
        [
          `\n[Request] ${req.method} ${req.url}`,
          `[Body] ${JSON.stringify(req.body, null, 1)}`,
          `[Query] ${JSON.stringify(req.query, null, 1)}`,
          `[Response] ${res.statusCode} ${JSON.stringify(
            responseBody,
            null,
            1,
          )}`,
        ].join('\n'),
        'ApplicationLoggerMiddleware',
      );
    });

    next();
  }
}
