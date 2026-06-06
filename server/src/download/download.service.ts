import { Injectable } from '@nestjs/common';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class DownloadService {
  constructor(private readonly clientService: ClientsService) {}

  triggerDownload(clientId: string, fileUrl: string) {
    const client = this.clientService.get(clientId);

    if (!client) {
      console.error(`No WebSocket found for clientId: ${clientId}`);
      return {
        message: `No WebSocket found for clientId: ${clientId}`,
      };
    }

    if (!client.connected) {
      console.error(`WebSocket for clientId: ${clientId} is not connected`);
      return {
        message: `WebSocket for clientId: ${clientId} is not connected`,
      };
    }

    client.emit('DOWNLOAD', { url: fileUrl });
    return {
      message: 'Download triggered successfully',
    };
  }
}
