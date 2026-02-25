// los paquetes que son de node van al inicio
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
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
    MongooseModule.forRoot('mongodb://localhost/nest-pokemon'),

    PokemonModule,
  ],
})
export class AppModule {}
