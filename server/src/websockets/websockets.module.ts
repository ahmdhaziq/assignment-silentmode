import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';
import { FileTransferModule } from 'src/file-transfer/file-transfer.module';
import { WebsocketsGateway } from './websockets.gateway';

@Module({
  imports: [ClientsModule, FileTransferModule],
  controllers: [],
  providers: [WebsocketsGateway],
})
export class WebsocketsModule {}
