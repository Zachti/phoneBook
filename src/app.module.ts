import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { mysqlConfigObject, redisConfigObject, mysqlConfig  } from './config';
import { ContactModule } from './contact/contact.module';
import { Contact } from './contact/entities/contact.entity';
import { HealthModule } from './health/health.module';
import { TypeOrmExceptionFilter } from './exceptionsFilter/typeOrmError.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mysqlConfigObject.config, redisConfigObject.config],
      validationSchema: [mysqlConfigObject.validationSchema, redisConfigObject.validationSchema]
        .reduce((curr, next) => {
        return curr.concat(next)
      }),
      validationOptions: { presence: 'required' },
    }),
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      useFactory: (mysqlCfg: ConfigType<typeof mysqlConfig>) => {
        return {
          type: 'mysql',
          host: mysqlCfg.host,
          port: mysqlCfg.port,
          username: mysqlCfg.username,
          password: mysqlCfg.password,
          database: mysqlCfg.database,
          entities: [Contact],
          synchronize: false,
        };
      },
      inject: [mysqlConfig.KEY],
    }),
    LoggerModule,
    ContactModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
  ],
})
export class AppModule {}
