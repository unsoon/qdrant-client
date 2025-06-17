import { QdrantClient as QdrantGrpcClient } from "@qdrant/js-client-grpc";
import { QdrantClient as QdrantRestClient } from "@qdrant/js-client-rest";

import { QdrantClientOptions, QdrantClientType } from "./qdrant.interfaces";

const clients: Record<QdrantClientType, typeof QdrantGrpcClient | typeof QdrantRestClient> = {
  grpc: QdrantGrpcClient,
  rest: QdrantRestClient,
};

export function createQdrantClient({ type, options }: QdrantClientOptions) {
  const QdrantClient = clients[type] ?? QdrantRestClient;

  return new QdrantClient(options);
}
