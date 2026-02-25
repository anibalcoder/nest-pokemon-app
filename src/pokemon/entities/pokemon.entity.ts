import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() // Decorador que indica que esta clase es un esquema de Mongoose
export class Pokemon extends Document {
  // Document representa un documento real de MongoDB y agrega métodos como save().

  @Prop({
    unique: true, // No se pueden repetir nombres
    index: true, // Crea un índice para mejorar la búsqueda por nombre
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon); // Crea el esquema a partir de la clase Pokemon
