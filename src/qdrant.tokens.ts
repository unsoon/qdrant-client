import { Inject } from '@nestjs/common';

export function getQdrantClientToken(name: string): symbol {
  return Symbol.for(`qdrant:${name}`);
}

export function InjectQdrantClient(name: string): ParameterDecorator {
  return Inject(getQdrantClientToken(name));
}
