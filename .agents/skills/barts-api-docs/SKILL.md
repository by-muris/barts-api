---
name: barts-api-docs
description: Generate OpenAPI documentation for @by-muris/barts-api and optionally expose Swagger UI. Use when adding DTO schemas, endpoint docs, OpenAPI JSON, or a docs controller.
---

# Document a Barts API

Add DTO classes with class-validator rules and Barts' `JSONSchema` decorator. Reference those classes in endpoint `docs`:

```ts
import { JSONSchema } from '@by-muris/barts-api'
import { IsString } from 'class-validator'

export class TodoResponseDto {
  @IsString()
  @JSONSchema({ example: 'Buy milk' })
  name!: string
}
```

```ts
docs: {
  summary: 'Gets a TODO',
  tags: ['todos'],
  responses: { 200: TodoResponseDto, 404: undefined },
}
```

Register all controllers before generating the document. An OpenAPI JSON-only controller needs no extra package:

```ts
import { createOpenApiDocument } from '@by-muris/barts-api'
import type { Application } from 'express'

export const createDocsController = (app: Application) => {
  app.get('/openapi.json', (_req, res) => {
    res.json(createOpenApiDocument())
  })
}
```

For Swagger UI, install `swagger-ui-express` and add:

```ts
import swaggerUi from 'swagger-ui-express'

app.use('/docs', swaggerUi.serve, swaggerUi.setup(createOpenApiDocument()))
```

Call `createDocsController(app)` after application controllers. See [`example/controllers/docs/controller.ts`](../../../example/controllers/docs/controller.ts) for the combined OpenAPI JSON and Swagger UI setup.
