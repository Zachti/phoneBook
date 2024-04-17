import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'), // todo create redis config object
        host: 'redis',
        port: 6379,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheCoreModule {}
