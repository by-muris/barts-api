---
name: barts-api-controller
description: Add a route controller to a @by-muris/barts-api consumer application. Use when grouping endpoints under a shared path or wiring handlers into Express.
---

# Add a Barts controller

Group related endpoints under one base path with `controller`:

```ts
import { controller } from '@by-muris/barts-api'
import { handleGetAllTodosAsync } from './get-all-todos/handler.js'

export const todosController = controller('/api/todos', ({ endpoint }) => {
  endpoint('/', 'get', () => handleGetAllTodosAsync())
})
```

Export the controller and call it from the application entrypoint after `app.use(express.json())`. The paths are joined: `controller('/api/todos')` plus `endpoint('/:id', ...)` produces `/api/todos/:id`.

Keep route wiring in the controller and business behavior in handlers. Use the endpoint skill when adding request bodies, validation, or OpenAPI docs.

See [`example/controllers/todo/controller.ts`](../../../example/controllers/todo/controller.ts).
