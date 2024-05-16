import { Module } from '@nestjs/common'
import { SocketService } from './socket.service'
import { SocketGateway } from './socket.gateway'
import { PrismaService } from 'src/db/prisma.service'
import { MessageService } from '../message/message.service'
import { UserService } from '../user/user.service'
import { RoomService } from '../room/room.service'

@Module({
  providers: [
    SocketGateway,
    SocketService,
    PrismaService,
    MessageService,
    UserService,
    RoomService,
  ],
})
export class SocketModule {}
