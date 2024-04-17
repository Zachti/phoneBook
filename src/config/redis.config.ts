import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { ConfigObject } from './config-module-options';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  ttl: Number(process.env.CACHE_TTL),
  port: Number(process.env.REDIS_PORT),
}));

const redisConfigValidationSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  CACHE_TTL: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
});

export const redisConfigObject: ConfigObject = {
  config: redisConfig,
  validationSchema: redisConfigValidationSchema,
};
