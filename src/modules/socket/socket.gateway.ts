import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { SocketService } from './socket.service'
import { OnModuleInit, UsePipes, ValidationPipe } from '@nestjs/common'
import { MessageService } from '../message/message.service'
import { Server, Socket } from 'socket.io'
import { MassagesType } from './dto/new-user'
import { $Enums } from '@prisma/client'
import { Message, Update } from 'grammy/types'
import { RoomService } from '../room/room.service'

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
})
export class SocketGateway implements OnModuleInit {
  constructor(
    private readonly socketService: SocketService,
    private messagesService: MessageService,
    private room: RoomService,
  ) {}
  status: boolean = true

  userRoom: { [id: number]: string } = {}

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Connected id session ${socket.id}`)
    })

    this.server.on('disconnect', (reason, details) => {
      console.log(`disconnect session ${reason}`)
    })
  }

  @SubscribeMessage('connectChat')
  @UsePipes(new ValidationPipe())
  async handleEvent(
    @MessageBody()
    user: MassagesType,
    @ConnectedSocket() client: Socket,
  ) {
    this.userRoom[user.id] = client.id
    console.log(this.userRoom)

    const newMessages = {
      userId: user.id,
      msg: user.messages,
      idTgMessages: 0,
      role: $Enums.Who.USER,
    }

    const createNewMassages =
      await this.messagesService.newMessages(newMessages)

    if (!createNewMassages) {
      throw new Error('Сообщение не добавленно в базу')
    }
    console.log(`Сообщение из чата в базе ${createNewMassages}`)

    // Отправка в ТГ
    const { messagesId, messages, user: userBio } = createNewMassages
    const sendTg = await this.socketService.sendMessageInClient(
      messages,
      userBio.name,
      userBio.id,
    )

    const { message_id } = sendTg
    const updateId = await this.messagesService.updateIdMessages(
      messagesId,
      message_id,
    )

    if (!updateId) {
      throw new Error('Сообщение не доставленно в ТГ')
    }
    const { idTgMessages } = updateId
    console.log(`Сообщение отправленно в ТГ ${messages}`)

    const sendMsg = async (message: Message & Update.NonChannel) => {
      const { message_id: id, message_thread_id, text } = message
      const newMessages = await this.socketService.checkMessages(
        id,
        message_thread_id,
        text,
      )
      if (newMessages) {
        this.server
          .to(this.userRoom[newMessages.userId])
          .emit('newMessages', newMessages)
      }
    }

    this.socketService.listeningChat(idTgMessages, sendMsg)
  }

  @SubscribeMessage('ping')
  async closeConnection(
    @MessageBody()
    status: { messages: string; status: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(this.userRoom)
    console.log(status)

    if (status.messages === 'ping') {
      console.log('disconnect', status)
    }
  }
}
