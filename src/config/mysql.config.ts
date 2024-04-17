import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigObject } from './config-module-options';

export const mysqlConfig = registerAs('mysql', () => ({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,
  port: Number(process.env.DATABASE_PORT),
}));

const mysqlConfigValidationSchema = Joi.object({
  DATABASE_HOST: Joi.string().uri().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DB_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.string(),
});

export const mysqlConfigObject: ConfigObject = {
  config: mysqlConfig,
  validationSchema: mysqlConfigValidationSchema,
};
