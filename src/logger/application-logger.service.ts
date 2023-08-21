import { ConsoleLogger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as AppLogLevel from './appLogLevel';
import { FileLoggerTransport } from './file-logger-transport';

export class ApplicationLogger extends ConsoleLogger {
  private static readonly logLevelEnvKey = 'LOG_LEVEL';
  private static readonly logMaxFileSizeEnvKey = 'LOG_MAX_FILE_SIZE';

  private readonly logLevel: AppLogLevel.AppLogLevel =
    AppLogLevel.AppLogLevel.verbose;
  private readonly fileLoggerTransport: FileLoggerTransport;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    super();

    this.logLevel = AppLogLevel.fromString(
      configService.get(ApplicationLogger.logLevelEnvKey),
    );
    const logMaxFileSize =
      Number(configService.get(ApplicationLogger.logMaxFileSizeEnvKey)) ?? 1024;

    this.fileLoggerTransport = new FileLoggerTransport(
      'application-logs',
      Number(configService.get(ApplicationLogger.logMaxFileSizeEnvKey)) ?? 1024,
    );

    this.verbose(
      `Initialized with params ${JSON.stringify({
        logLevel: this.logLevel,
        logMaxFileSize: logMaxFileSize,
      })}`,
      'ApplicationLogger',
    );
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.verbose) {
      return;
    }
    super.verbose(message, ...optionalParams);
    this.fileLoggerTransport.verbose(message);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.debug) {
      return;
    }
    super.debug(message, ...optionalParams);
    this.fileLoggerTransport.debug(message);
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.log) {
      return;
    }
    super.log(message, ...optionalParams);
    this.fileLoggerTransport.log(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.warn) {
      return;
    }
    super.warn(message, ...optionalParams);
    this.fileLoggerTransport.warn(message);
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.error) {
      return;
    }
    super.error(message, ...optionalParams);
    this.fileLoggerTransport.error(message);
  }

  private stringify(some: unknown) {
    try {
      return JSON.stringify(some, null, 1);
    } catch {
      try {
        return some.toString();
      } catch {
        return 'UNSERIALIZABLE';
      }
    }
  }

  formatHttp(args: {
    request: Request;
    response: {
      status: number;
      body: unknown;
    };
    exception?: unknown;
  }) {
    const commonPart = [
      `\n[Request] ${args.request.method} ${args.request.url}`,
      `[Body] ${this.stringify(args.request.body)}`,
      `[Query] ${this.stringify(args.request.query)}`,
      `[Response] ${args.response.status} ${this.stringify(
        args.response.body,
      )}`,
    ];
    if (args.exception) {
      commonPart.push(`[Exception] ${this.stringify(args.exception)}`);
    }
    return commonPart.join('\n');
  }
}
