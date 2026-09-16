import 'reflect-metadata'
import express from 'express'
import { createDocsController } from './controllers/docs/controller.js'
import { todosController } from './controllers/todo/controller.js'

const app = express()

app.use(express.json())

todosController(app)
createDocsController(app)

app.listen(3000, () => {
  console.log('API listening on http://localhost:3000')
})
