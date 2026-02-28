// los paquetes que son de node van al inicio
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    /**
     * Carga las variables de entorno desde el archivo .env
     * y las hace disponibles globalmente en la aplicación NestJS
     * mediante process.env y el ConfigService.
     *
     * Recomendación: definir primero para cargar las variables de entorno antes de iniciar la aplicación.
     */
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema, // Valida las variables de entorno al iniciar la app usando Joi
    }),

    // Configura el módulo para servir archivos estáticos
    ServeStaticModule.forRoot({
      /**
       * Define la ruta física donde están los archivos estáticos.
       * __dirname → carpeta actual del archivo compilado.
       * '..' → sube un nivel en el directorio.
       * 'public' → carpeta donde están los archivos a exponer.
       */
      rootPath: join(__dirname, '..', 'public'),
    }),

    /**
     * MongooseModule.forRoot() es un método que configura la conexión a MongoDB utilizando Mongoose.
     * El argumento 'mongodb://localhost/nest-pokemon' es la URL de conexión a la base de datos MongoDB.
     * Mongoose es un librería que permite trabajar con MongoDB mediante esquemas y modelos.
     */
    MongooseModule.forRoot(process.env.MONGODB!),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {}
