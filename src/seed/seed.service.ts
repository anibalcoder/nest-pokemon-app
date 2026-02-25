import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from './adapters/axios.adapter';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly http: AxiosAdapter,
    private readonly pokemonService: PokemonService,
  ) {}

  async execteSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    const pokemonSeed: CreatePokemonDto[] = data.results.map(
      ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];

        return { name, no };
      },
    );

    await this.pokemonService.fillPokemonsWithSeedData(pokemonSeed);
    return 'Executed seed successfull';
  }
}
