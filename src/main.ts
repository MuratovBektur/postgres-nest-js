
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function start () {
  const PORT = process.env.PORT ?? 5000
  const app = await NestFactory.create(AppModule) 
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('i-link example')
    .setDescription('The i-link API description')
    .setVersion('1.0')
    .addTag('i-link')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('explorer', app, document)
  await app.listen(PORT, () => console.log('Server was runned on port:' + PORT))
}

start()