import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [DownloadController],
  providers: [DownloadService],
  exports: [DownloadService],
  imports: [ClientsModule],
})
export class DownloadModule {}
