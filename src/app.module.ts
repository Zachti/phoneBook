import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { mongoConfig, mysqlConfig, validationSchema } from './config';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, mysqlConfig],
      validationSchema,
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
    TypeOrmModule.forRootAsync({
      name: 'mongodb',
      useFactory: (mongoCfg: ConfigType<typeof mongoConfig>) => {
        return {
          type: 'mongodb',
          host: mongoCfg.host,
          port: mongoCfg.port,
          database: mongoCfg.database,
          collection: mongoCfg.collection,
          synchronize: false,
          entities: [MongoTodo],
        };
      },
      inject: [mongoConfig.KEY],
    }),
    LoggerModule,
    ContactModule,
  ],
})
export class AppModule {}
