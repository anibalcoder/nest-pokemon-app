import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  exports: [PokemonService],
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    // forFeature() -> registra modelos dentro de un módulo.
    MongooseModule.forFeature([
      {
        /**
         * Ese name No tiene relación con Pokemon.name.
         * Pokemon.name es una propiedad nativa de JavaScript que devuelve el nombre de la clase (Pokemon.name → string "Pokemon").
         */
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
})
export class PokemonModule {}

// Name sale del documento
