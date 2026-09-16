import { JSONSchema } from '@by-muris/barts-api'
import {IsArray, IsEnum, IsInstance, IsInt, IsString, ValidateNested} from 'class-validator'
import { Type } from 'class-transformer'

export enum TodoType {
  Personal = 'personal',
  Work = 'work'
}

export class TodoUser {
  @IsInt()
  @JSONSchema({ example: 1 })
  id!: number

  @IsString()
  @JSONSchema({ example: 'Buy milk' })
  name!: string
}

export class TodoDto {
  @IsInt()
  @JSONSchema({ example: 1 })
  id!: number

  @IsString()
  @JSONSchema({ example: 'Buy milk' })
  name!: string

  @IsEnum(TodoType)
  @JSONSchema({ example: TodoType.Personal, enum: Object.values(TodoType) })
  type!: TodoType;

  @IsInstance(TodoUser)
  @JSONSchema({ example: {
    id: 1,
      name: 'Arthur'
  }})
  user!: TodoUser
}

export class GetAllTodosResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TodoDto)
  @JSONSchema({
    type: 'array',
    items: { $ref: '#/components/schemas/TodoDto' },
  })
  todos!: TodoDto[]
}
