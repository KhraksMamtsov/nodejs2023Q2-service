import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ApplicationLogger } from './logger/application-logger.service';
import * as process from 'process';
import { ApplicationExceptionsFilter } from './app.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(ApplicationLogger);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useLogger(logger);
  app.useGlobalFilters(
    new ApplicationExceptionsFilter(httpAdapterHost, logger),
  );

  process.on('unhandledRejection', async (reason) => {
    logger.error('unhandledRejection', reason, 'process');
  });
  process.on('uncaughtException', (error) => {
    logger.error('uncaughtException', error, 'process');
  });

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());

  const port = app.get(ConfigService).get('PORT') || 4000;

  await app.listen(port, () =>
    logger.verbose(`Server listen on port: ${port}`, 'bootstrap'),
  );
}

bootstrap();
