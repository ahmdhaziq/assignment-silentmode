import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ClientsService } from 'src/clients/clients.service';
import { FileTransferService } from 'src/file-transfer/file-transfer.service';

@WebSocketGateway(8080, {
  cors: { origin: '*' },
  maxHttpBufferSize: 2 * 1024 * 1024, // allow 1MB chunks with overhead
})
export class WebsocketsGateway implements OnGatewayConnection {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly fileTransferService: FileTransferService,
  ) {}

  handleConnection() {
    console.log('WebSocket connected');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('WebSocket disconnected');
    this.clientsService.removeBySocket(client);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log('Received message:', payload);
    return 'Message received';
  }

  @SubscribeMessage('REGISTER')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const { clientId } = payload;
    const registered = this.clientsService.registerClient(clientId, client);
    if (!registered) {
      console.error('Failed to register client:', clientId);
      return { error: 'Failed to register client' };
    }
    if (registered) {
      console.log('Client registered:', clientId);
    }
    return { message: 'Registration received' };
  }

  @SubscribeMessage('UPLOAD_CHUNKS')
  async handleFileChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
    callback: (response: any) => void,
  ): Promise<void> {
    console.log('Received file chunk:', payload);
    const data = {
      fileId: payload?.fileId,
      fileName: payload?.fileName,
      chunkIndex: payload?.chunkIndex,
      totalChunks: payload?.totalChunks,
      isLastChunk: payload?.isLastChunk,
      chunkData: payload?.chunkData,
    };
    try {
      const result = await this.fileTransferService.handleFileChunk(data);
      if (result.status === 'complete') {
        console.log('File upload complete:', result.filePath);
        client.emit('UPLOAD_COMPLETE', { filePath: result.filePath });
      } else if (result.status === 'chunk_received') {
        console.log(
          `Chunk ${result.chunkIndex} received for file ${data.fileName}`,
        );
        client.emit('UPLOAD_PROGRESS', {
          status: 'chunk_received',
          chunkIndex: result.chunkIndex,
        });
      } else {
        console.error('Error handling file chunk');
        client.emit('UPLOAD_ERROR', { error: 'Error handling file chunk' });
      }

      callback({ message: 'Chunk processed' });
    } catch (error) {
      console.error('Error processing file chunk:', error);
      client.emit('UPLOAD_ERROR', { error: 'Error processing file chunk' });
      callback({ error: 'Error processing file chunk' });
    }
  }
}
