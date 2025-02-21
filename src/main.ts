import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  app.enableCors({
    origin: `http://localhost:${port}`,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Routex API')
    .setDescription('The Routex API description')
    .setVersion('1.0')
    .addTag('routex')
    .addBearerAuth()
    .build();
  const docFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, docFactory);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(port);

  Logger.log(`Server is running on port ${port}`);
  Logger.log(`Swagger is running on http://localhost:${port}/api`);
}
bootstrap();
