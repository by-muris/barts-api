import { JSONSchema } from '@by-muris/barts-api'
import {IsEnum, IsInstance, IsInt, IsString} from 'class-validator'

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

export class GetTodoResponseDto {
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
