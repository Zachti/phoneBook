import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from './config-module-options';
import { DynamicModule, Module } from '@nestjs/common';
@Module({})
export class ConfigCoreModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const { isGlobal, configObjects, validationOptions } = options;
    return {
      global: isGlobal,
      module: ConfigCoreModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: isGlobal,
          load: [...configObjects.map((configObject) => configObject.config)],
          validationSchema: configObjects
            .map((configObject) => configObject.validationSchema)
            .reduce((curr, next) => {
              return curr.concat(next);
            }),
          validationOptions: validationOptions ?? undefined,
        }),
      ],
      providers: [ConfigCoreModule],
      exports: [ConfigCoreModule],
    };
  }
}
