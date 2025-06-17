# Nestjs Qdrant Client <img src="https://avatars.githubusercontent.com/u/73504361?s=200&v=4" align="right" width="150" height="150" style="margin: 0px 0px 10px 10px" >

**@unsoon/qdrant-client** is a NestJS dynamic module that provides seamless integration with Qdrant's REST and gRPC clients.  
It enables you to connect, configure, and inject multiple Qdrant clients in a scalable and type-safe way — ideal for production-grade vector search applications.

## 🚀 Features

- 🧠 Type-safe configuration (per client)
- 🧩 Supports both gRPC and REST clients
- 🎯 Inject clients by name (multitenancy, separation of concerns)
- 🧼 Tiny, clean and dependency-light

## 📦 Installation

```bash
npm install --save @unsoon/qdrant-client
```

👇 This module also requires the following peer dependencies:

```bash
npm install --save @qdrant/{js-client-grpc,js-client-rest}
```

## 🧑‍💻 Quick Start

### Single REST client (static config)

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { QdrantModule } from "@unsoon/qdrant-client";

@Module({
  imports: [
    QdrantModule.forRoot({
        name: "my-qdrant-client",
        type: "rest",
        options: {
            url: "http://localhost:6333",
        },
    });
  ],
})
export class AppModule {}
```

### 🪄 Injecting

```ts
// search.service.ts

import { Injectable } from "@nestjs/common";
import { InjectQdrantClient, QdrantRestClient } from "@unsoon/qdrant-client";

@Injectable()
export class SearchService {
  constructor(
    @InjectQdrantClient("my-qdrant-client")
    private readonly client: QdrantRestClient,
  ) {}
}
```

## 🏋️‍♂️ Advantage usage

### 🔧 Async Configuration (useFactory)

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { QdrantModule } from "@unsoon/qdrant-client";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    QdrantModule.forRootAsync({
        name: "my-qdrant-client",
        type: "rest",
        useFactory: (config: ConfigService) => ({
            url: config.get("QDRANT_HTTP_URL"),
            headers: {
                "x-api-key": config.get("QDRANT_API_KEY"),
            },
        }),
        inject: [ConfigService],
    });
  ],
})
export class AppModule {}
```

### 🧱 Async Configuration (useClass)

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { QdrantModule } from "@unsoon/qdrant-client";
import { ConfigModule } from "@nestjs/config";

import { QdrantGrpcClientService } from "./qdrant-grpc.config.ts";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    QdrantModule.forRootAsync({
        name: "my-qdrant-grpc-client",
        type: "grpc",
        useClass: QdrantGrpcClientService,
    });
  ],
})
export class AppModule {}
```

```ts
// qdrant-grpc.config.ts

import { Injectable } from "@nestjs/common";
import { QdrantFactoryClass, QdrantGrpcClientParams } from "@unsoon/qdrant-client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class QdrantGrpcClientService implements QdrantFactoryClass<"grpc"> {
  constructor(private readonly config: ConfigService) {}

  createQdrantOptions(): QdrantGrpcClientParams {
    return {
      url: this.config.get("QDRANT_GRPC_URL"),
    };
  }
}
```

### ♻️ Multiple Clients (gRPC + REST)

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { QdrantModule } from "@unsoon/qdrant-client";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { QdrantGrpcClientService } from "./qdrant-grpc.config.ts";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    QdrantModule.forRootAsync([
        {
            name: "my-qdrant-grpc-client",
            type: "grpc",
            useClass: QdrantGrpcClientService,
        },
        {
            name: "my-qdrant-rest-client",
            type: "rest",
            useFactory: (config: ConfigService) => ({
                url: config.get("QDRANT_HTTP_URL"),
            }),
            inject: [ConfigService],
        },
    ]);
  ],
})
export class AppModule {}
```

Then inject as:

```ts
// search.service.ts

import { Injectable } from "@nestjs/common";
import { InjectQdrantClient, QdrantRestClient, QdrantGrpcClient } from "@unsoon/qdrant-client";

@Injectable()
export class SearchService {
  constructor(
    @InjectQdrantClient("my-qdrant-grpc-client")
    private readonly grpcClient: QdrantGrpcClient,

    @InjectQdrantClient("my-qdrant-rest-client")
    private readonly restClient: QdrantRestClient,
  ) {}
}
```

## 📘 License

This package is distributed under the [MIT License](LICENSE).
