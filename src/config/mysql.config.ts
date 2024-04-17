import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const mysqlConfig = registerAs('mysql', () => ({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,
  port: Number(process.env.DATABASE_PORT)
}));

export const mysqlConfigValidationSchema = Joi.object({
  DATABASE_HOST: Joi.string().uri().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DB_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.string(),
});
