import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Module({
  controllers: [],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
