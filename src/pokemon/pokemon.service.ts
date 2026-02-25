import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
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

    try {
      // Inserta un nuevo documento en MongoDB usando el modelo
      // Se usa await porque la operación es asíncrona y devuelve una Promise.
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new BadRequestException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        `Can't create Pokemon - Check server logs`,
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    // Busca por número (campo "no")
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: Number(term) });
    }

    // Si no se encontró, busca por _id (MongoID)
    if (!pokemon && isValidObjectId(term)) {
      // findById -> busca solo por _id
      pokemon = await this.pokemonModel.findById(term);
    }

    // Si aún no existe, busca por nombre normalizado
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    await pokemon.updateOne(updatePokemonDto, { new: true }); // new: true -> Devuelve el documento actualizado y no el original

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...pokemon.toJSON(), // toJSON() -> Convierte el documento de Mongoose a un objeto JavaScript plano
      ...updatePokemonDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
