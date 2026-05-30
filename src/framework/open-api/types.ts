import { Method } from '@/framework/api/types'

export type ClassType<T = unknown> = new (...args: any[]) => T
export type Responses = Record<number, ClassType | undefined>

export type OpenApiMethod = Method

export type OpenApiSchemaRef = {
  $ref: string
}

export type OpenApiMediaType = {
  schema: OpenApiSchemaRef
}

export type OpenApiRequestBody = {
  required?: boolean
  content: {
    'application/json': OpenApiMediaType
  }
}

export type OpenApiResponse = {
  description: string
  content?: {
    'application/json': OpenApiMediaType
  }
}

export type OpenApiParameter = {
  name: string
  in: 'path'
  required: boolean
  schema: {
    type: 'string'
  }
}

export type OpenApiOperation = {
  summary?: string
  tags?: string[]
  parameters?: OpenApiParameter[]
  requestBody?: OpenApiRequestBody
  responses: Record<string, OpenApiResponse>
}

export type OpenApiDocsOptions = {
  summary?: string
  tags?: string[]
  requestBody?: ClassType
  responses: Responses
}

export type OpenApiPathItem = Partial<Record<OpenApiMethod, OpenApiOperation>>

export type OpenApiPaths = Record<string, OpenApiPathItem>
