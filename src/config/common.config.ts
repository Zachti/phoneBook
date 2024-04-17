import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('common', () => ({
  nodeEnv: process.env['NODE_ENV'],
  logLevel: process.env['LOG_LEVEL'] || 'debug',
}));

export const commonConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .not('dev', 'prod', 'DEV', 'PROD', 'DEVELOPMENT', 'PRODUCTION')
    .required(),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .optional(),
});
