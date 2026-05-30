import type {
  ClassType,
  OpenApiParameter,
  OpenApiRequestBody,
  OpenApiResponse,
  OpenApiSchemaRef,
  Responses,
} from '@/framework/open-api/types'

export function schemaRef(type: ClassType): OpenApiSchemaRef {
  return {
    $ref: `#/components/schemas/${type.name}`,
  }
}

export function createRequestBody(body?: ClassType): OpenApiRequestBody | undefined {
  if (!body) {
    return undefined
  }
  return {
    required: true,
    content: {
      'application/json': {
        schema: schemaRef(body),
      },
    },
  }
}

export function createResponses(
  responses: Responses = { 200: undefined },
): Record<string, OpenApiResponse> {
  return Object.fromEntries(
    Object.entries(responses).map(([status, responseType]) => {
      const response: OpenApiResponse = {
        description: getStatusDescription(Number(status)),
      }
      if (responseType) {
        response.content = {
          'application/json': {
            schema: schemaRef(responseType),
          },
        }
      }
      return [status, response]
    }),
  )
}

export function createPathParameters(endpointPath: string): OpenApiParameter[] {
  const parameterNames = Array.from(endpointPath.matchAll(/:([^/]+)/g)).map((match) => match[1])

  return parameterNames.map((name) => ({
    name,
    in: 'path',
    required: true,
    schema: {
      type: 'string',
    },
  }))
}

function getStatusDescription(status: number): string {
  switch (status) {
    case 200:
      return 'OK'
    case 201:
      return 'Created'
    case 204:
      return 'No Content'
    case 400:
      return 'Bad Request'
    case 401:
      return 'Unauthorized'
    case 404:
      return 'Not Found'
    case 500:
      return 'Internal Server Error'
    default:
      return 'Response'
  }
}

export function toOpenApiPath(controllerPath: string, endpointPath: string): string {
  const joined = `${controllerPath}${endpointPath === '/' ? '' : endpointPath}`
  return joined.replace(/:([^/]+)/g, '{$1}')
}
