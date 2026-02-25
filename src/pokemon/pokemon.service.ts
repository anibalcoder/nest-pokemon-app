import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    // Inyecta el modelo de Mongoose registrado con el nombre "Pokemon".
    @InjectModel(Pokemon.name)
    /**
     * Modelo de Mongoose que representa la colección (Pokemon)
     * y expone métodos como create(), find(), save(), etc.
     */
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    // Normaliza el nombre a minúsculas antes de guardarlo
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    // Inserta un nuevo documento en MongoDB usando el modelo
    const pokemon = await this.pokemonModel.create(createPokemonDto);

    return pokemon;
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
