import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApplicationLogger } from './application-logger.service';

@Injectable()
export class ApplicationLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: ApplicationLogger) {}
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
      const bodyString = Buffer.concat(chunks).toString('utf8');

      let responseBody: string;
      try {
        responseBody = JSON.parse(bodyString);
      } catch {
        responseBody = bodyString;
      }

      this.logger.verbose(
        this.logger.formatHttp({
          request: req,
          response: { status: res.statusCode, body: responseBody },
        }),
        'ApplicationLoggerMiddleware',
      );
    });

    next();
  }
}
