import { JSONSchema } from '@by-muris/barts-api'
import { IsInt, IsString } from 'class-validator'

export class CreateTodoResponseDto {
  @IsInt()
  @JSONSchema({ example: 1 })
  id!: number

  @IsString()
  @JSONSchema({ example: 'Buy milk' })
  name!: string
}
