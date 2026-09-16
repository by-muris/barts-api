---
name: barts-api-error-or
description: Use the @by-muris/barts-api ErrorOr result model in handlers and filters. Use when returning successful responses, HTTP errors, or choosing Barts response status types.
---

# Use ErrorOr

Barts endpoint handlers and filters must return `ErrorOr<T>` instead of writing to Express responses directly.

```ts
import { error, ErrorType, ok, ResultType } from '@by-muris/barts-api'
import type { ErrorOr } from '@by-muris/barts-api'

export function handleCreateTodoAsync(
  request: CreateTodoRequestDto,
): ErrorOr<CreateTodoResponseDto> {
  if (!request.name.trim()) {
    return error(ErrorType.Validation, 'name is required')
  }

  return ok({ id: 1, name: request.name }, { type: ResultType.Created })
}
```

`Ok`, `Created`, and `NoContent` map to 200, 201, and 204. `Validation`, `Unauthorized`, `Forbidden`, `NotFound`, `Conflict`, and `Unexpected` map to 400, 401, 403, 404, 409, and 500.

Use `ErrorType.Validation` for rejected input. Do not wrap a handler result in `ok(...)` again: return the handler's `ErrorOr<T>` directly from the endpoint.
