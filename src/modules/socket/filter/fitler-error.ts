import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'

@Catch()
export class WebsocketExceptionFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient()
    const messages = exception.message

    socket.emit('exception', {
      status: 'error connecting',
      messages: `${messages}`,
    })
  }
}
