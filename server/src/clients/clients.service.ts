import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsService {
  private clients = new Map<string, WebSocket>();

  registerClient(clientId: string, ws: WebSocket): boolean {
    this.clients.set(clientId, ws);
    return true;
  }

  get(clientId: string) {
    return this.clients.get(clientId);
  }

  getAll() {
    return Array.from(this.clients.entries()).map(([clientId, ws]) => ({
      clientId,
      ws,
    }));
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  removeBySocket(ws: WebSocket): void {
    for (const [clientId, socket] of this.clients.entries()) {
      if (socket === ws) {
        this.clients.delete(clientId);
        break;
      }
    }
  }
}
