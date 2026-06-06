import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ClientsService } from 'src/clients/clients.service';

@WebSocketGateway({ port: 8080 })
export class WebsocketsGateway {
  constructor(private readonly clientsService: ClientsService) {}

  handleConnection(client: WebSocket) {
    console.log('WebSocket connected');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Received message:', payload);
    return 'Message received';
  }

  @SubscribeMessage('REGISTER')
  handleRegister(
    @ConnectedSocket() ws: WebSocket,
    @MessageBody() payload: any,
  ): string {
    const { clientId } = payload;
    const registered = this.clientsService.registerClient(clientId, ws);
    if (!registered) {
      console.error('Failed to register client:', clientId);
    }
    if (registered) {
      console.log('Client registered:', clientId);
    }
    return 'Registration received';
  }
}
