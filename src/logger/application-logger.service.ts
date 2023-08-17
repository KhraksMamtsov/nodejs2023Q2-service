import { ConsoleLogger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AppLogLevel from './appLogLevel';

export class ApplicationLogger extends ConsoleLogger {
  private static readonly logLevelEnvKey = 'LOG_LEVEL';
  private static readonly logMaxFileSizeEnvKey = 'LOG_MAX_FILE_SIZE';

  private readonly logLevel: AppLogLevel.AppLogLevel =
    AppLogLevel.AppLogLevel.verbose;
  private readonly logMaxFileSize: number = 1024;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    super();

    this.logLevel = AppLogLevel.fromString(
      configService.get(ApplicationLogger.logLevelEnvKey),
    );

    this.logMaxFileSize =
      Number(configService.get(ApplicationLogger.logMaxFileSizeEnvKey)) ?? 1024;

    this.verbose(
      `Initialized with params ${JSON.stringify({
        logLevel: this.logLevel,
        logMaxFileSize: this.logMaxFileSize,
      })}`,
      'ApplicationLogger',
    );
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.verbose) {
      return;
    }
    super.verbose(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.debug) {
      return;
    }
    console.debug('debug', message, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.log) {
      return;
    }
    super.log(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.warn) {
      return;
    }
    console.warn('warn', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.logLevel < AppLogLevel.AppLogLevel.error) {
      return;
    }
    super.error(message, ...optionalParams);
  }
}
