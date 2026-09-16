import { JSONSchema } from '@by-muris/barts-api'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTodoRequestDto {
  @IsString()
  @IsNotEmpty()
  @JSONSchema({ example: 'Buy milk' })
  name!: string
}
