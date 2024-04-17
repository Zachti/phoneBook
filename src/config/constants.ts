import { mysqlConfigValidationSchema } from './mysql.config';
import { redisConfigValidationSchema } from './redis.config';

export const validationSchema =
  mysqlConfigValidationSchema && redisConfigValidationSchema;
