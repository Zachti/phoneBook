import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const mysqlConfig = registerAs('mysql', () => ({
  url: process.env.MYSQL_URL,
}));

export const mysqlConfigValidationSchema = Joi.object({
  MYSQL_URL: Joi.string().uri().required(),
});
