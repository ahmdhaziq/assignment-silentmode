import { Controller, Param, Post } from '@nestjs/common';
import { DownloadService } from './download.service';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Post(':clientId')
  downloadFile(@Param('clientId') clientId: string) {
    // Implement file download logic here
    return this.downloadService.triggerDownload(clientId, './test_100mb.txt');
  }
}
