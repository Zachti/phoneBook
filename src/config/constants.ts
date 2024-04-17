import { mongoConfigValidationSchema } from './mongo.config';
import { postgresConfigValidationSchema } from './mysql.config';

export const validationSchema =
  mongoConfigValidationSchema && postgresConfigValidationSchema;
