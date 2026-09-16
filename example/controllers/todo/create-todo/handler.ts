import { ok } from '@by-muris/barts-api'
import type { ErrorOr } from '@by-muris/barts-api'
import type { CreateTodoRequestDto } from './request.js'
import type { CreateTodoResponseDto } from './response.js'

export function handleCreateTodoAsync(
  request: CreateTodoRequestDto,
): ErrorOr<CreateTodoResponseDto> {
  return ok({
    id: Math.floor(Math.random() * 1_000_000),
    name: request.name,
  })
}
