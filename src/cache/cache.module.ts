import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigType } from '@nestjs/config';
import { redisConfig } from '../config/redis.config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (redisCfg: ConfigType<typeof redisConfig>) => ({
        ttl: redisCfg.ttl,
        host: redisCfg.host,
        port: redisCfg.port,
      }),
      inject: [redisConfig.KEY],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheCoreModule {}
