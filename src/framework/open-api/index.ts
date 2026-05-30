import type { OpenApiDocsOptions, OpenApiOperation } from '@/framework/open-api/types'
import type { Method } from '@/framework/api/types'
import {
  createPathParameters,
  createRequestBody,
  createResponses,
  toOpenApiPath,
} from '@/framework/open-api/fn'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'

const paths: Record<string, Partial<Record<Method, OpenApiOperation>>> = {}

export function createOpenApiDocument() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Planner API',
      version: '0.1.0',
    },
    paths,
    components: {
      schemas: validationMetadatasToSchemas({
        refPointerPrefix: '#/components/schemas/',
      }),
    },
  }
}

export function registerOpenApiEndpoint(args: {
  controllerPath: string
  endpointPath: string
  method: Method
  docs: OpenApiDocsOptions
}) {
  const fullPath = toOpenApiPath(args.controllerPath, args.endpointPath)
  paths[fullPath] ??= {}
  paths[fullPath][args.method] = {
    summary: args.docs.summary,
    tags: args.docs.tags,
    parameters: createPathParameters(args.endpointPath),
    requestBody: createRequestBody(args.docs.requestBody),
    responses: createResponses(args.docs.responses),
  }
}

export type {
  ClassType,
  OpenApiDocsOptions,
  OpenApiOperation,
  OpenApiPaths,
  Responses,
} from '@/framework/open-api/types'
