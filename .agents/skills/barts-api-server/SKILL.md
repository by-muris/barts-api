---
name: barts-api-server
description: Start a minimal Express server that uses @by-muris/barts-api. Use when creating an application entrypoint, adding JSON parsing, or registering Barts controllers.
---

# Start a Barts API server

Create an entrypoint that loads metadata first, configures JSON parsing, registers controllers, and starts Express:

```ts
import 'reflect-metadata'
import express from 'express'
import { todosController } from './controllers/todo/controller.js'

const app = express()
app.use(express.json())
todosController(app)
app.listen(3000)
```

Keep HTTP setup in the entrypoint and business behavior in handlers. Register every controller before creating an OpenAPI document; endpoint documentation is collected at registration time.

For a complete working entrypoint, see [`example/index.ts`](../../../example/index.ts).
