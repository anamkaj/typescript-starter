import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findChat(id: number) {
    const chatId = await this.prisma.chats.findFirst({
      where: {
        chatId: id,
      },
      include: {
        messages: {},
      },
    })

    return chatId
  }
}
