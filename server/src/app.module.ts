import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { DownloadModule } from './download/download.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { FileTransferModule } from './file-transfer/file-transfer.module';

@Module({
  imports: [
    ClientsModule,
    DownloadModule,
    WebsocketsModule,
    FileTransferModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
