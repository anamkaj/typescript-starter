import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class MassagesType {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  messages: string

  @IsNumber()
  @IsNotEmpty()
  room: number

  @IsString()
  @IsNotEmpty()
  role: string
}
