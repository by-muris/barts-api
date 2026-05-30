import { NextFunction, Request, Response, Router } from 'express'
import { StatusCodeMap } from '@/framework/error-or/constants'
import type {
  EndpointFn,
  EndpointOptions,
  FilterFn,
  HandleFn,
  Method,
  MiddlewareFn,
} from '@/framework/api/types'
import { registerOpenApiEndpoint } from '@/framework/open-api'

export const getEndpointFn: (
  router: Router,
  controllerPath: string,
  controllerFilters: FilterFn[],
  controllerMiddleware: MiddlewareFn[],
) => EndpointFn = (
  router: Router,
  controllerPath: string,
  controllerFilters: FilterFn[],
  controllerMiddleware: MiddlewareFn[],
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

    const endpointMiddleware = options?.middlewares ?? []
    const middleware = [...controllerMiddleware, ...endpointMiddleware]

    const callback = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const endpointFilters = options?.filters ?? []
        const filters = [...controllerFilters, ...endpointFilters]

        for (const filter of filters) {
          const filterResult = await filter(req)
          if (!filterResult.ok) {
            res
              .status(StatusCodeMap[filterResult.error.type])
              .json({ error: filterResult.error.message })
              .end()
            return
          }
        }

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
        router.get(path, ...middleware, callback)
        break
      case 'post':
        router.post(path, ...middleware, callback)
        break
      case 'patch':
        router.patch(path, ...middleware, callback)
        break
      case 'put':
        router.put(path, ...middleware, callback)
        break
      case 'delete':
        router.delete(path, ...middleware, callback)
        break
    }
  }
}
