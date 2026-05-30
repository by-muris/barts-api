import type { NextFunction, Request, Response } from 'express'
import type { ErrorOr } from '@/framework/error-or'
import type { ClassType, Responses } from '@/framework/open-api/types'

export type EndpointFilter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | PromiseLike<void>
export type HandleFn<T> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => ErrorOr<T> | PromiseLike<ErrorOr<T>>
export type Method = 'get' | 'post' | 'patch' | 'put' | 'delete'
export type EndpointDocs = {
  summary?: string
  tags?: string[]
  requestBody?: ClassType
  responses?: Responses
}

export type EndpointOptions = {
  onUnhandledException?: 'throw'
  docs?: EndpointDocs
  filters?: EndpointFilter[]
}

export type EndpointFn<T = unknown> = (
  path: string,
  method: Method,
  handler: HandleFn<T>,
  options?: EndpointOptions,
) => void

export type ControllerOptions = {
  filters?: EndpointFilter[]
}
export type ControllerFn = (args: { endpoint: EndpointFn }) => void
