import { Who } from '@prisma/client'

export class MessagesType {
  userId: number
  msg: string
  idTgMessages?: number
  role: Who
  chatsChatId?: number
}
