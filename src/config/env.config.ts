/**
 * Transforma las variables de .env en un objeto de configuración
 * centralizado para la aplicación.
 *
 * Permite:
 * - Definir valores por defecto.
 * - Tipar las variables de entorno y convertir tipos (string → number).
 * - Acceder a la config vía ConfigService.
 *
 * Se debe evita usar process.env directamente porque:
 * - Siempre retorna strings.
 * - No tiene tipado.
 * - Obliga a repetir conversiones y defaults a lo largo de la app.
 *  - Number(process.env.PORT || 3000);
 *  - Boolean(process.env.ENABLED || false);
 */
export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev', // Entorno de ejecución (dev, prod)
  dbName: process.env.DB_NAME || 'pokemonsdb',
  mongodb: process.env.MONGODB,
  /**
   * process.env siempre devuelve valores como string,
   * Si la variable no existe, se usa el valor por defecto (7),
   * pero cuando sí existe seguirá siendo string.
   */
  port: Number(process.env.PORT) || 3002,
  defaultLimit: Number(process.env.DEFAULT_LIMIT) || 7,
});
