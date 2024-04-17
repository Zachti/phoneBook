import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigObject } from './config-module-options';

export const mysqlConfig = registerAs('mysql', () => ({
  url: process.env.DATABASE_URL,
}));

const mysqlConfigValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
});

export const mysqlConfigObject: ConfigObject = {
  config: mysqlConfig,
  validationSchema: mysqlConfigValidationSchema,
};
