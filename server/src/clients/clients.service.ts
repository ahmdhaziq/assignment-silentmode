import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientsService {
  private clients = new Map<string, Socket>();

  registerClient(clientId: string, ws: Socket): boolean {
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

  removeBySocket(ws: Socket): void {
    for (const [clientId, socket] of this.clients.entries()) {
      if (socket === ws) {
        this.clients.delete(clientId);
        break;
      }
    }
  }
}
