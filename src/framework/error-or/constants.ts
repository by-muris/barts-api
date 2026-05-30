import { ErrorType, ResultType } from '@/framework/error-or/types'

export const StatusCodeMap = {
  [ResultType.Ok]: 200,
  [ResultType.Created]: 201,
  [ResultType.NoContent]: 204,
  [ErrorType.Validation]: 400,
  [ErrorType.NotFound]: 404,
  [ErrorType.Conflict]: 409,
  [ErrorType.Unauthorized]: 401,
  [ErrorType.Forbidden]: 403,
  [ErrorType.Unexpected]: 500,
} as const satisfies Record<ErrorType | ResultType, number>
