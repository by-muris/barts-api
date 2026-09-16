import { controller, error, ErrorType } from '@by-muris/barts-api'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { handleCreateTodoAsync } from './create-todo/handler.js'
import { CreateTodoRequestDto } from './create-todo/request.js'
import { CreateTodoResponseDto } from './create-todo/response.js'
import { handleGetAllTodosAsync } from './get-all-todos/handler.js'
import { GetAllTodosResponseDto } from './get-all-todos/response.js'
import { handleGetTodoAsync } from './get-todo/handler.js'
import { GetTodoResponseDto } from './get-todo/response.js'

export const todosController = controller('/api/todos', ({ endpoint }) => {
  endpoint('/', 'get', () => handleGetAllTodosAsync(), {
    docs: {
      summary: 'Gets all TODOs',
      tags: ['todos'],
      responses: {
        200: GetAllTodosResponseDto,
        500: undefined,
      },
    },
  })

  endpoint(
    '/',
    'post',
    async (req) => {
      const request = plainToInstance(CreateTodoRequestDto, req.body)
      const validationErrors = await validate(request, {
        whitelist: true,
        forbidNonWhitelisted: true,
      })

      if (validationErrors.length > 0) {
        const message = validationErrors
          .flatMap((validationError) => Object.values(validationError.constraints ?? {}))
          .join(', ')

        return error(ErrorType.Validation, message || 'Invalid create TODO request')
      }

      return handleCreateTodoAsync(request)
    },
    {
      docs: {
        summary: 'Creates a TODO',
        tags: ['todos'],
        requestBody: CreateTodoRequestDto,
        responses: {
          200: CreateTodoResponseDto,
          400: undefined,
          500: undefined,
        },
      },
    },
  )

  endpoint('/:id', 'get', (req) => handleGetTodoAsync(Number(req.params.id)), {
    docs: {
      summary: 'Gets a TODO',
      tags: ['todos'],
      responses: {
        200: GetTodoResponseDto,
        404: undefined,
        500: undefined,
      },
    },
  })
})
