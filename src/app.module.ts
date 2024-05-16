import { Module } from '@nestjs/common'
import { PrismaService } from './db/prisma.service'
import { UserModule } from './modules/user/user.module'
import { SocketModule } from './modules/socket/socket.module'
import { RoomModule } from './modules/room/room.module'

@Module({
  imports: [RoomModule, UserModule, SocketModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
