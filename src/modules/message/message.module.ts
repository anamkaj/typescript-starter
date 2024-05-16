import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageController } from './message.controller'
import { UserService } from '../user/user.service'
import { PrismaService } from 'src/db/prisma.service'

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [MessageService, UserService, PrismaService],
})
export class MessageModule {}
