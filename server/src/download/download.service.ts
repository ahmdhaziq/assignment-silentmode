import { Injectable } from '@nestjs/common';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class DownloadService {
  constructor(private readonly clientService: ClientsService) {}

  triggerDownload(clientId: string, fileUrl: string) {
    const ws = this.clientService.get(clientId);

    if (!ws) {
      console.error(`No WebSocket found for clientId: ${clientId}`);
      return {
        message: `No WebSocket found for clientId: ${clientId}`,
      };
    }

    ws.send(JSON.stringify({ type: 'DOWNLOAD', url: fileUrl }));
    return {
      message: 'Download triggered successfully',
    };
  }
}
