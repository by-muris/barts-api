![Barts API](.github/cat.png)

# @by-muris/barts-api

An opinionated Express API framework for small `by-muris` services.

`@by-muris/barts-api` provides:

- controller and endpoint registration
- endpoint and controller filters using the `ErrorOr` result model
- optional raw Express middleware for third-party integrations
- OpenAPI document generation from decorated DTO classes
- an `ErrorOr` result model with HTTP status mapping
- a small dependency-injection container

## Opinionated By Design

This package deliberately keeps the request flow narrow. Endpoint handlers return
`ErrorOr<T>` values, and the framework converts those results into HTTP responses.

Once you adopt the package, you are intentionally locked into the `ErrorOr` ecosystem
for endpoint and filter results:

```ts
return ok({ todos: [] })
return error(ErrorType.Validation, 'title is required')
```

This is not intended to be an unopinionated collection of Express helpers. The benefit
is predictable controller code, consistent HTTP error responses, and a small framework
surface.

## Installation

Install the package and its peer dependencies:

```bash
npm install @by-muris/barts-api express class-validator class-transformer reflect-metadata
```

If the app exposes Swagger UI, install that separately:

```bash
npm install swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

Swagger UI stays app-side. The package generates the OpenAPI document but does not
decide which URL should expose documentation.

## TypeScript Configuration

Decorated DTO classes require decorator metadata:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Import `reflect-metadata` once before registering controllers:

```ts
import 'reflect-metadata'
```

## Express Setup

Register controllers before generating the OpenAPI document. Endpoint docs are collected
while controllers are registered.

```ts
import 'reflect-metadata'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { createOpenApiDocument } from '@by-muris/barts-api'
import { todosController } from './controllers/todos.controller.js'

const app = express()

app.use(express.json())

todosController(app)

app.get('/openapi.json', (_req, res) => {
  res.json(createOpenApiDocument())
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(createOpenApiDocument()))

app.listen(3000)
```

## Controllers And Endpoints

A controller groups endpoints under a shared path:

```ts
import { controller, error, ErrorType, ok } from '@by-muris/barts-api'

export const todosController = controller('/todos', ({ endpoint }) => {
  endpoint('/', 'get', () => {
    return ok({
      todos: [],
    })
  })

  endpoint('/', 'post', (req) => {
    const title = req.body?.title

    if (typeof title !== 'string' || !title.trim()) {
      return error(ErrorType.Validation, 'title is required')
    }

    return ok({
      id: crypto.randomUUID(),
      title: title.trim(),
    })
  })
})
```

Supported endpoint methods:

```ts
;'get' | 'post' | 'patch' | 'put' | 'delete'
```

Successful results default to HTTP `200`:

```ts
return ok(response)
```

Select a different success status when needed:

```ts
import { ok, ResultType } from '@by-muris/barts-api'

return ok(response, { type: ResultType.Created })
```

Errors map to consistent HTTP status codes:

```ts
import { error, ErrorType } from '@by-muris/barts-api'

return error(ErrorType.NotFound, 'TODO was not found')
```

## Swagger Docs

Use decorated DTO classes for request and response schemas:

```ts
import { IsBoolean, IsString, MinLength } from 'class-validator'
import { JSONSchema } from 'class-validator-jsonschema'

export class CreateTodoRequest {
  @IsString()
  @MinLength(1)
  @JSONSchema({ example: 'Buy milk' })
  title!: string
}

export class TodoResponse {
  @IsString()
  @JSONSchema({ example: '8f6f0a2a-48f6-4c15-91a0-3dfb95d72575' })
  id!: string

  @IsString()
  @JSONSchema({ example: 'Buy milk' })
  title!: string

  @IsBoolean()
  @JSONSchema({ example: false })
  completed!: boolean
}
```

Reference DTO classes from endpoint docs:

```ts
import { controller, ok } from '@by-muris/barts-api'
import { CreateTodoRequest, TodoResponse } from './todo.dto.js'

export const todosController = controller('/todos', ({ endpoint }) => {
  endpoint(
    '/',
    'post',
    (req) => {
      return ok({
        id: crypto.randomUUID(),
        title: req.body.title,
        completed: false,
      })
    },
    {
      docs: {
        summary: 'Creates a TODO',
        tags: ['todos'],
        requestBody: CreateTodoRequest,
        responses: {
          200: TodoResponse,
          400: undefined,
          500: undefined,
        },
      },
    },
  )
})
```

The response value `undefined` documents a status without a JSON response schema:

```ts
responses: {
  204: undefined,
}
```

Route parameters are detected automatically:

```ts
endpoint('/:id', 'patch', handler, {
  docs: {
    summary: 'Updates a TODO',
    responses: {
      200: TodoResponse,
    },
  },
})
```

This produces an OpenAPI route parameter for `{id}`.

## Dependency Injection

The package includes a deliberately small DI container.

Define a typed token:

```ts
import { token } from '@by-muris/barts-api'
import type { Database } from './database.js'

export const DATABASE = token<Database>('DATABASE')
```

Register a value:

```ts
import { register } from '@by-muris/barts-api'
import { DATABASE } from './providers.js'
import { db } from './database.js'

register(DATABASE, db)
```

Register a singleton factory:

```ts
register(DATABASE, () => createDatabase(), {
  lifetime: 'singleton',
})
```

Register a transient factory:

```ts
register(DATABASE, () => createDatabase(), {
  lifetime: 'transient',
})
```

Inject the value where needed:

```ts
import { inject } from '@by-muris/barts-api'
import { DATABASE } from './providers.js'

const db = inject(DATABASE)
```

The DI container intentionally supports only values and zero-argument factories. It is
small enough to understand at a glance.

## Auth With Filters

Filters are part of the opinionated `ErrorOr` request flow. A filter receives the
Express request, enriches or inspects it, and returns an `ErrorOr` result. The framework
converts filter errors into HTTP responses before the endpoint handler runs.

First, augment the Express request type:

```ts
// src/types/express.d.ts
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string
      role: 'user' | 'admin'
    }
  }
}

export {}
```

Create an auth filter factory:

```ts
import { error, ErrorType, ok, type FilterFn } from '@by-muris/barts-api'

export function requireAuth(): FilterFn {
  return async (req) => {
    const authorization = req.header('authorization')

    if (!authorization) {
      return error(ErrorType.Unauthorized, 'Unauthorized')
    }

    const user = await verifyToken(authorization)

    if (!user) {
      return error(ErrorType.Unauthorized, 'Unauthorized')
    }

    req.user = user
    return ok(undefined)
  }
}
```

Apply a filter to one endpoint:

```ts
endpoint('/', 'get', handler, {
  filters: [requireAuth()],
})
```

Apply a filter to every endpoint in a controller:

```ts
export const todosController = controller(
  '/todos',
  ({ endpoint }) => {
    endpoint('/', 'get', handler)
    endpoint('/', 'post', createHandler)
  },
  {
    filters: [requireAuth()],
  },
)
```

Filter factories can take configuration:

```ts
import { error, ErrorType, ok, type FilterFn } from '@by-muris/barts-api'

export function requireRole(role: 'user' | 'admin'): FilterFn {
  return (req) => {
    if (req.user?.role !== role) {
      return error(ErrorType.Forbidden, 'Forbidden')
    }

    return ok(undefined)
  }
}
```

Then compose filters:

```ts
filters: [requireAuth(), requireRole('admin')]
```

Filters run in order:

```text
controller filters -> endpoint filters -> endpoint handler
```

## Raw Express Middleware

Use `middlewares` when integrating a third-party Express middleware package or when
you deliberately need direct access to `res` and `next`.

```ts
import type { MiddlewareFn } from '@by-muris/barts-api'

const requestLogger: MiddlewareFn = (req, _res, next) => {
  console.log(req.method, req.path)
  next()
}
```

Apply middleware to one endpoint:

```ts
endpoint('/', 'get', handler, {
  middlewares: [requestLogger],
})
```

Or apply it to every endpoint in a controller:

```ts
export const todosController = controller('/todos', registerEndpoints, {
  middlewares: [requestLogger],
})
```

Middleware runs before filters:

```text
controller middleware -> endpoint middleware -> controller filters -> endpoint filters -> endpoint handler
```
