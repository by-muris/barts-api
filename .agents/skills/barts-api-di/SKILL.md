---
name: barts-api-di
description: Register and inject dependencies with @by-muris/barts-api. Use when defining typed tokens, application values, singleton factories, or transient factories.
---

# Use Barts dependency injection

Create a typed token, register a value or zero-argument factory during application startup, then inject it where needed:

```ts
import { inject, register, token } from '@by-muris/barts-api'

type TodoStore = {
  find(id: number): Promise<{ id: number; name: string } | undefined>
}

export const TODO_STORE = token<TodoStore>('TODO_STORE')

register(TODO_STORE, () => createTodoStore(), { lifetime: 'singleton' })

const todoStore = inject(TODO_STORE)
```

`register(token, value)` stores a value. Factories are transient by default and run on every `inject`; pass `{ lifetime: 'singleton' }` to create once on first injection. Register dependencies before any handler calls `inject`.

The container supports only values and zero-argument factories. Compose factory dependencies explicitly with `inject` inside the factory when necessary.
