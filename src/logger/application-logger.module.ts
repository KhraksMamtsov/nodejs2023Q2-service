import { Global, Module } from '@nestjs/common';
import { ApplicationLogger } from './application-logger.service';
import { ConfigModule } from '@nestjs/config';
import { ApplicationLoggerMiddleware } from './application-logger.middleware';

@Global()
@Module({
  providers: [ApplicationLogger, ApplicationLoggerMiddleware],
  exports: [ApplicationLogger, ApplicationLoggerMiddleware],
  imports: [ConfigModule],
})
export class ApplicationLoggerModule {}
