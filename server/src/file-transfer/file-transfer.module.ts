import { Module } from '@nestjs/common';
import { FileTransferService } from './file-transfer.service';

@Module({
  controllers: [],
  providers: [FileTransferService],
  exports: [FileTransferService],
})
export class FileTransferModule {}
