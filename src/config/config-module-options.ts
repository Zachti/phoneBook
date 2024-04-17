import { ObjectSchema } from 'joi';
import { ConfigFactory } from '@nestjs/config';

export interface ConfigObject {
  config: ConfigFactory;
  validationSchema: ObjectSchema;
}
export interface ConfigModuleOptions {
  isGlobal: boolean;
  configObjects: ConfigObject[];
  validationOptions?: Record<string, any>;
}
