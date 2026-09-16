import { createOpenApiDocument } from '@by-muris/barts-api'
import type { Application } from 'express'
import swaggerUi from 'swagger-ui-express'

export const createDocsController = (app: Application) => {
  app.get('/openapi.json', (_req, res) => {
    res.json(createOpenApiDocument())
  })

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(createOpenApiDocument()))
}
