import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { UserService } from '../user/user.service'
import { MessagesType } from './dto/messages-type'
import { RoomService } from '../room/room.service'

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private user: UserService,
  ) {}
  async newMessages(messages: MessagesType) {
    const user = await this.user.findByName(messages.userId)

    if (user == null) {
      throw new ConflictException(
        'Вы не можете отправлять сообщения в чат, зарегистрируйтесь!',
      )
    }

    const { id, chatsChatId } = user
    console.log(messages)
    const createNewMassages = await this.prisma.messages.create({
      data: {
        messages: messages.msg,
        userId: id,
        role: messages.role,
        chatsChatId: chatsChatId,
        idTgMessages: messages.idTgMessages,
      },
      include: {
        chat: {},
        user: {},
      },
    })
    return createNewMassages
  }

  async updateIdMessages(id: number, clientId: number) {
    const update = await this.prisma.messages.update({
      where: {
        messagesId: id,
      },
      data: {
        idTgMessages: clientId,
      },
    })
    return update
  }

  async findMessages(id: number) {
    const messages = await this.prisma.messages.findUnique({
      where: {
        idTgMessages: id,
      },
      include: {
        chat: {},
      },
    })

    return messages
  }
}
