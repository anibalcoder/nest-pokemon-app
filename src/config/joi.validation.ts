import * as Joi from 'joi';

/**
 * joi.validation.ts
 * - Se usa para validar las variables del .env al iniciar la app.
 * - Si falta una variable o el tipo es incorrecto, la app se detiene inmediatamente.
 * - Su finalidad es mostrar errores claros y descriptivos
 * cuando falta una variable o tiene un tipo incorrecto.
 *
 * Sin Joi:
 * - La app inicia y falla después en runtime con errores confusos.
 *
 * Flujo: .env → Joi valida → env.config organiza → ConfigService usa
 */
export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.string().required().messages({
    'any.required': '❌ La variable MONGODB es obligatoria',
    'string.empty': '❌ MONGODB no puede estar vacía',
  }),
  DB_NAME: Joi.string().default('pokemonsdb'),
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT: Joi.number().default(6),
});
