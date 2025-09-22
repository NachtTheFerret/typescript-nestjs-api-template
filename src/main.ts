/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Declare module for Hot Module Replacement (HMR)
// This is necessary to avoid TypeScript errors
// when using HMR with NestJS
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI, // Versioning via URI path (e.g., /v1/)
    defaultVersion: '1',
  });

  // Enable CORS for all origins
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    })
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('NestJS API Template')
    .setDescription('A template for building RESTful APIs with NestJS and Prisma')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
      description: 'Enter JWT token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Persist authorization token across page reloads
      docExpansion: 'none', // Collapse all sections by default
    },
  });

  // Start the application
  await app.listen(process.env.PORT ?? 3000);

  // Hot Module Replacement setup
  if (module.hot) {
    module.hot.accept(); // Accept updates for this module
    module.hot.dispose(() => app.close()); // Dispose the app instance on module replacement
  }
}

// Bootstrap the application and handle any errors
bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
