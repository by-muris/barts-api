import { NextFunction, Request, Response, Router } from 'express'
import { StatusCodeMap } from '@/framework/error-or/constants'
import type {
  EndpointFn,
  EndpointOptions,
  EndpointFilter,
  HandleFn,
  Method,
} from '@/framework/api/types'
import { registerOpenApiEndpoint } from '@/framework/open-api'

export const getEndpointFn: (
  router: Router,
  controllerPath: string,
  controllerFilters: EndpointFilter[],
) => EndpointFn = (
  router: Router,
  controllerPath: string,
  controllerFilters: EndpointFilter[],
): EndpointFn => {
  return <TResult = unknown>(
    path: string,
    method: Method,
    handle: HandleFn<TResult>,
    options?: EndpointOptions,
  ) => {
    if (options?.docs) {
      registerOpenApiEndpoint({
        controllerPath,
        endpointPath: path,
        method,
        docs: {
          summary: options.docs.summary,
          tags: options.docs.tags,
          requestBody: options.docs.requestBody,
          responses: options.docs.responses || {},
        },
      })
    }
    const endpointFilters = options?.filters ?? []
    const filters = [...controllerFilters, ...endpointFilters]
    const callback = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await handle(req, res, next)
        if (result.ok) {
          res.status(StatusCodeMap[result.type]).json(result.value).end()
        } else {
          res.status(StatusCodeMap[result.error.type]).json({ error: result.error.message }).end()
        }
      } catch (e) {
        if (options?.onUnhandledException === 'throw') {
          throw e
        }
        res.status(500).json({
          error: (e as any).message ?? 'Unexpected error occurred',
        })
      }
    }
    switch (method) {
      case 'get':
        router.get(path, ...filters, callback)
        break
      case 'post':
        router.post(path, ...filters, callback)
        break
      case 'patch':
        router.patch(path, ...filters, callback)
        break
      case 'put':
        router.put(path, ...filters, callback)
        break
      case 'delete':
        router.delete(path, ...filters, callback)
        break
    }
  }
}
