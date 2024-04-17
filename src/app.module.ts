import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { mysqlConfig, validationSchema } from './config';
import { ContactModule } from './contact/contact.module';
import { Contacts } from './contact/entities/contact.entity';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mysqlConfig, redisConfig],
      validationSchema,
      validationOptions: { presence: 'required' },
    }),
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      useFactory: (mysqlCfg: ConfigType<typeof mysqlConfig>) => {
        return {
          type: 'mysql',
          url: mysqlCfg.url,
          entities: [Contacts],
          synchronize: false,
        };
      },
      inject: [mysqlConfig.KEY],
    }),
    LoggerModule,
    ContactModule,
  ],
})
export class AppModule {}
