import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  ttl: Number(process.env.CACHE_TTL),
  port: Number(process.env.REDIS_PORT),
}));

export const redisConfigValidationSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  CACHE_TTL: Joi.number().required(),
  REDIS_PORT: Joi.number().required(),
});
