import { Injectable } from '@nestjs/common'
import { Bot } from 'grammy'
import { Message, Update } from 'grammy/types'
import { MessageService } from '../message/message.service'
import { $Enums } from '@prisma/client'

@Injectable()
export class SocketService {
  constructor(private messagesService: MessageService) {}

  private bot = new Bot(process.env.TELEGRAM_BOT)

  async listeningChat(
    idTgMessages: number,
    sendMsg: (message: Message & Update.NonChannel) => void,
  ) {
    const processedMessageIds = new Set()

    while (true) {
      try {
        const updateChat = await this.bot.api.getUpdates({
          offset: -1,
          limit: 4,
        })

        updateChat.forEach(({ message }) => {
          if (
            message.message_thread_id == idTgMessages &&
            !processedMessageIds.has(message.message_id)
          ) {
            processedMessageIds.add(message.message_id)
            sendMsg(message)
          }
        })
      } catch (error) {
        console.error('Error fetching updates:', error)
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  async checkMessages(id: number, threadId: number, text: string) {
    const findIdMassages = await this.messagesService.findMessages(id)

    if (findIdMassages !== null) {
      console.log(`сообщение уже есть в базе${findIdMassages.messages}}`)
    } else {
      if (threadId !== undefined) {
        const findRespMessages =
          await this.messagesService.findMessages(threadId)

        const newMessages = {
          userId: findRespMessages.userId,
          msg: text,
          idTgMessages: id,
          role: $Enums.Who.BOT,
        }

        const createNewMassages =
          await this.messagesService.newMessages(newMessages)

        console.log('Сообщение из Группы успешно добавленно в базу ')
        return createNewMassages
      }
    }
  }

  async sendMessageInClient(messages: string, name: string, id: number) {
    const message = await this.bot.api.sendMessage(
      process.env.CHAT_GROUP,
      `
      Имя: ${name} - ID ${id}
      
      Сообщение: ${messages}
      
      `,
    )
    return message
  }
}
