/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    // Inyecta el modelo de Mongoose registrado con el nombre "Pokemon".
    @InjectModel(Pokemon.name)
    /**
     * Modelo de Mongoose que representa la colección (Pokemon)
     * y expone métodos como create(), find(), save(), etc.
     */
    private readonly pokemonModel: Model<Pokemon>,
    /**
     * Inyecta el servicio de configuración de NestJS.
     * Permite acceder a las variables definidas en .env y cargadas mediante EnvConfiguration.
     */
    private readonly configService: ConfigService,
  ) {
    /**
     * get<T>() permite tipar el valor obtenido,
     * ya que ConfigService retorna `any` por defecto.
     */
    this.defaultLimit = configService.get<number>('DEFAULT_LIMIT')!;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    // Normaliza el nombre a minúsculas antes de guardarlo
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      // Inserta un nuevo documento en MongoDB usando el modelo
      // Se usa await porque la operación es asíncrona y devuelve una Promise.
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v'); // Excluye (-) el campo __v del resultado
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

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true }); // new: true -> Devuelve el documento actualizado y no el original

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return {
        ...pokemon.toJSON(), // toJSON() -> Convierte el documento de Mongoose a un objeto JavaScript plano
        ...updatePokemonDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });

    /**
     * Así se evita realizar dos consultas a la base de datos (una para buscar y otra para eliminar)
     * Solo se realiza una consulta y si esa consulta arroja 0 eliminados, se lanza la excepción de no encontrado.
     */
    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with id "${id}" not found`);

    return;
  }

  async fillPokemonsWithSeedData(pokemons: CreatePokemonDto[]) {
    const result = this.pokemonModel.insertMany(pokemons);
    return result;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    throw new InternalServerErrorException(
      "Can't update Pokemon - Check server logs",
    );
  }
}
