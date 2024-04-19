import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { mysqlConfigObject, redisConfigObject, mysqlConfig } from './config';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/entities/contact.entity';
import { HealthModule } from './health/health.module';
import { TypeOrmExceptionFilter } from './exceptionsFilter/typeOrmError.filter';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigCoreModule } from './config/config.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { SeedModule } from './typeorm/seed/seed.module';

@Module({
  imports: [
    ConfigCoreModule.forRoot({
      isGlobal: true,
      configObjects: [mysqlConfigObject, redisConfigObject],
      validationOptions: { presence: 'required' },
    }),
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      useFactory: (mysqlCfg: ConfigType<typeof mysqlConfig>) => {
        return {
          type: 'mysql',
          url: mysqlCfg.url,
          entities: [Contact],
          synchronize: false,
        };
      },
      inject: [mysqlConfig.KEY],
    }),
    LoggerModule,
    ContactModule,
    HealthModule,
    SeedModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class PhoneBookModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
