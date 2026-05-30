import { Request, Response } from 'express'
import { type ErrorOr, ErrorType, ResultType } from './types'
import { StatusCodeMap } from '@/framework/error-or/constants'

export const ok = <T>(value: T, options?: { type: ResultType }): ErrorOr<T> => ({
  ok: true,
  value,
  type: options?.type ?? ResultType.Ok,
})

export const error = <T = never>(
  type: ErrorType,
  message: string,
  details?: unknown,
): ErrorOr<T> => ({
  ok: false,
  error: { type, message, details },
})

export const withErrorHandling = async (
  req: Request,
  res: Response,
  fn: (req: Request, res: Response) => ErrorOr<unknown> | PromiseLike<ErrorOr<unknown>>,
) => {
  try {
    const result = await fn(req, res)
    if (result.ok) {
      res.status(StatusCodeMap[result.type]).json(result.value).end()
    } else {
      res.status(StatusCodeMap[result.error.type]).json({ error: result.error.message }).end()
    }
  } catch (e) {
    res.status(500).json({
      error: (e as any).message ?? 'Unexpected error occurred',
    })
  }
}
