import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [],
  providers: [],
})
export class WebsocketsModule {}
