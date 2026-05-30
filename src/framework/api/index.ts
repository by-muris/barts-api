import { Router } from 'express'
import type { Application } from 'express'
import type { ControllerFn, ControllerOptions } from '@/framework/api/types'
import { getEndpointFn } from '@/framework/api/fn'

export const controller = (
  path: string,
  fn: ControllerFn,
  options?: ControllerOptions,
): ((application: Application) => void) => {
  return (application: Application) => {
    const router = Router()
    const filters = options?.filters ?? []
    const middleware = options?.middlewares ?? []
    fn({
      endpoint: getEndpointFn(router, path, filters, middleware),
    })
    application.use(path, router)
  }
}

export type {
  ControllerFn,
  ControllerOptions,
  EndpointDocs,
  FilterFn,
  EndpointFn,
  EndpointOptions,
  HandleFn,
  Method,
  MiddlewareFn,
} from '@/framework/api/types'
