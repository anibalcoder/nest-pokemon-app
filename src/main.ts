import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setGlobalPrefix permite establecer un prefijo global para todas las rutas (endpoints) de la aplicación.
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Transforma los payloads a los tipos de datos definidos en los DTOs (Data Transfer Objects)
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos (por ejemplo, convertir una cadena a un número si el DTO lo define como un número)
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
