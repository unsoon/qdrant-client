import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { createQdrantClient } from "./qdrant.factory";
import {
  QdrantClientOptions,
  QdrantClientAsyncOptionsUnion,
  QdrantFactoryClass,
  QdrantClientType,
} from "./qdrant.interfaces";
import { getQdrantClientToken } from "./qdrant.tokens";

@Global()
@Module({})
export class QdrantModule {
  static forRoot(options: QdrantClientOptions | QdrantClientOptions[]): DynamicModule {
    const normalized = Array.isArray(options) ? options : [options];

    const providers: Provider[] = normalized.map((opt) => ({
      provide: getQdrantClientToken(opt.name),
      useValue: createQdrantClient(opt),
    }));

    return {
      module: QdrantModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(options: QdrantClientAsyncOptionsUnion | QdrantClientAsyncOptionsUnion[]): DynamicModule {
    const normalized = Array.isArray(options) ? options : [options];

    const providers: Provider[] = [];
    const extraProviders: Provider[] = [];

    for (const opt of normalized) {
      const token = getQdrantClientToken(opt.name);

      if ("useFactory" in opt) {
        providers.push({
          provide: token,
          useFactory: async (...args: unknown[]) => {
            const config = await opt.useFactory(...args);
            return createQdrantClient({
              name: opt.name,
              type: opt.type,
              options: config,
            });
          },
          inject: opt.inject ?? [],
        });
        continue;
      }

      const injectionToken = "useClass" in opt ? opt.useClass : opt.useExisting;

      if (!injectionToken) {
        throw new Error(`Invalid async configuration for ${opt.name}`);
      }

      providers.push({
        provide: token,
        useFactory: async (factory: QdrantFactoryClass<QdrantClientType>) => {
          const config = await factory.createQdrantOptions();
          return createQdrantClient({
            name: opt.name,
            type: opt.type,
            options: config,
          });
        },
        inject: [injectionToken],
      });

      if ("useClass" in opt) {
        extraProviders.push({
          provide: opt.useClass,
          useClass: opt.useClass,
        });
      }
    }

    return {
      module: QdrantModule,
      providers: [...providers, ...extraProviders],
      exports: providers,
    };
  }
}
