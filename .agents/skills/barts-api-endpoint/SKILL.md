---
name: barts-api-endpoint
description: Add documented @by-muris/barts-api endpoints with or without a request body. Use when defining HTTP methods, DTO validation, route parameters, or endpoint response documentation.
---

# Add Barts endpoints

Handlers return `ErrorOr<T>`. A bodyless endpoint can delegate directly:

```ts
endpoint('/:id', 'get', (req) => handleGetTodoAsync(Number(req.params.id)), {
  docs: {
    summary: 'Gets a TODO',
    tags: ['todos'],
    responses: { 200: GetTodoResponseDto, 404: undefined },
  },
})
```

For a JSON body, transform and validate at the HTTP boundary before calling the handler:

```ts
import { error, ErrorType } from '@by-muris/barts-api'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

endpoint('/', 'post', async (req) => {
  const body = plainToInstance(CreateTodoRequestDto, req.body)
  const errors = await validate(body, {
    whitelist: true,
    forbidNonWhitelisted: true,
  })

  if (errors.length > 0) {
    return error(ErrorType.Validation, 'Invalid create TODO request')
  }

  return handleCreateTodoAsync(body)
}, {
  docs: {
    summary: 'Creates a TODO',
    tags: ['todos'],
    requestBody: CreateTodoRequestDto,
    responses: { 200: CreateTodoResponseDto, 400: undefined },
  },
})
```

DTO decorators alone do not validate Express input. Add class-validator rules for runtime validation and reference DTO classes in `docs` to generate OpenAPI schemas. `/:id` automatically becomes an OpenAPI path parameter.

See [`example/controllers/todo/controller.ts`](../../../example/controllers/todo/controller.ts).
