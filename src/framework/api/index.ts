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
    fn({
      endpoint: getEndpointFn(router, path, filters),
    })
    application.use(path, router)
  }
}

export type {
  ControllerFn,
  ControllerOptions,
  EndpointDocs,
  EndpointFilter,
  EndpointFn,
  EndpointOptions,
  HandleFn,
  Method,
} from '@/framework/api/types'
