import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CacheService<T> {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private loggerService: LoggerService,
  ) {}

  get(key: string): Promise<T> {
    return this.cacheManager.get(key);
  }

  async set(key: string, value: T, logger = this.loggerService): Promise<void> {
    return this.cacheManager.set(key, value).then(() => {
      logger.debug('value cached', { key, value });
    });
  }

  async remove(key: string, logger = this.loggerService): Promise<void> {
    return this.cacheManager.del(key).then(() => {
      logger.debug('value removed', { key });
    });
  }

  async update(
    key: string,
    value: T,
    logger = this.loggerService,
  ): Promise<void> {
    await this.cacheManager.del(key);
    return this.cacheManager.set(key, value).then(() => {
      logger.debug('value updated', { key, value });
    });
  }
}
