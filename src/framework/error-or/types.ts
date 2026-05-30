export enum ErrorType {
  Validation = 'Validation',
  NotFound = 'NotFound',
  Conflict = 'Conflict',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  Unexpected = 'Unexpected',
}
export enum ResultType {
  Ok = 'Ok',
  Created = 'Created',
  NoContent = 'NoContent',
}
type ErrorDetails = {
  type: ErrorType
  message: string
  details?: unknown
}
export type ErrorOr<T> =
  | { ok: true; value: T; type: ResultType }
  | { ok: false; error: ErrorDetails }
