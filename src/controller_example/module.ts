import { Module } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
