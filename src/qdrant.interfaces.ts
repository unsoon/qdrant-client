import { Type } from "@nestjs/common";
import { QdrantClient as QdrantGrpcClient, QdrantClientParams as QdrantGrpcClientParams } from "@qdrant/js-client-grpc";
import { QdrantClient as QdrantRestClient, QdrantClientParams as QdrantRestClientParams } from "@qdrant/js-client-rest";

export type QdrantClientType = "grpc" | "rest";

export type { QdrantGrpcClient, QdrantRestClient, QdrantGrpcClientParams, QdrantRestClientParams };

export type ExtractParams<T extends QdrantClientType> = T extends "grpc"
  ? QdrantGrpcClientParams
  : T extends "rest"
    ? QdrantRestClientParams
    : never;

export interface QdrantClientBaseOptions<T extends QdrantClientType> {
  name: string;
  type: T;
}

export type QdrantClientOptions =
  | (QdrantClientBaseOptions<"grpc"> & { options: QdrantGrpcClientParams })
  | (QdrantClientBaseOptions<"rest"> & { options: QdrantRestClientParams });

export interface QdrantFactoryClass<T extends QdrantClientType> {
  createQdrantOptions(): ExtractParams<T> | Promise<ExtractParams<T>>;
}

export type QdrantClientAsyncOptionsUnion =
  | QdrantClientAsyncFactoryOptions<"grpc">
  | QdrantClientAsyncFactoryOptions<"rest">;

export type QdrantClientAsyncFactoryOptions<T extends QdrantClientType> =
  | (QdrantClientBaseOptions<T> & {
      useFactory: (...args: any[]) => ExtractParams<T> | Promise<ExtractParams<T>>;
      inject?: any[];
    })
  | (QdrantClientBaseOptions<T> & {
      useClass: Type<QdrantFactoryClass<T>>;
    })
  | (QdrantClientBaseOptions<T> & {
      useExisting: Type<QdrantFactoryClass<T>>;
    });
