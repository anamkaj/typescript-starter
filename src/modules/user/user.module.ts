import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/db/prisma.service'
import { RoomService } from '../room/room.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, RoomService],
})
export class UserModule {}
