import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { UserDto } from './dto/dto'
import { hash } from 'bcrypt'
import { RoomService } from '../room/room.service'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private room: RoomService,
  ) {}

  async newUser(data: UserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        tel: data.tel,
      },
    })

    if (user) {
      const findChat = await this.room.findChat(user.id)
      const { messages, ...chat } = findChat
      const { password, tel, email, ...data } = user
      return {
        chat: chat,
        user: { ...data, auth: true },
        messages: messages,
      }
    }

    const newRoom = await this.prisma.chats.create({})

    const createNewUser = await this.prisma.user.create({
      data: {
        ...data,
        email: `'default' + ${Math.random()}`,
        role: 'USER',
        password: await hash('default', 10),
        chatsChatId: newRoom.chatId,
      },
    })

    const { password, tel, email, ...result } = createNewUser

    return {
      chat: newRoom,
      user: { ...result, auth: true },
    }
  }

  async findByName(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        chat: {},
      },
    })

    const { password, ...res } = user
    return res
  }

  async userProfile(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    const { password, ...data } = user
    return data
  }
}
