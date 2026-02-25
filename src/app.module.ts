// los paquetes que son de node van al inicio
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';

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
    PokemonModule,
  ],
})
export class AppModule {}
