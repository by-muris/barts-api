import { ok } from '@by-muris/barts-api'
import type { ErrorOr } from '@by-muris/barts-api'
import { GetAllTodosResponseDto, TodoType } from './response.js'

export function handleGetAllTodosAsync(): ErrorOr<GetAllTodosResponseDto> {
  return ok({
    todos: [
      { id: 1, name: 'Buy milk', type: TodoType.Personal, user: { id: 5, name: 'Muris' } },
      { id: 2, name: 'Walk the dog', type: TodoType.Work, user: { id: 1, name: 'Arthur' } },
    ],
  })
}
