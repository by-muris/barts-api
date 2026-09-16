import { ok } from '@by-muris/barts-api'
import type { ErrorOr } from '@by-muris/barts-api'
import type { GetTodoResponseDto } from './response.js'
import {TodoType} from "../get-all-todos/response.js";

export function handleGetTodoAsync(id: number): ErrorOr<GetTodoResponseDto> {
  return ok({
    id,
    name: `Todo ${id}`,
    type: TodoType.Personal, user: { id: 5, name: 'Muris' }
  })
}
