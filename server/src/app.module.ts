import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketsGateway } from './websockets/websockets.gateway';
import { ClientsModule } from './clients/clients.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [ClientsModule, DownloadModule],
  controllers: [AppController],
  providers: [AppService, WebsocketsGateway],
})
export class AppModule {}
