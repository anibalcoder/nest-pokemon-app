import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService, AxiosAdapter],
  imports: [PokemonModule],
})
export class SeedModule {}
