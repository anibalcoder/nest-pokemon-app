import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setGlobalPrefix permite establecer un prefijo global para todas las rutas (endpoints) de la aplicación.
  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
