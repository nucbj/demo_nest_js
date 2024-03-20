import { Module } from '@nestjs/common';
import { DomainController } from './controller';
import { DomainService } from './service';
import { FirebaseService } from '../firebase/firebase';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [DomainController],
  providers: [DomainService, FirebaseService],
  imports: [ConfigModule],
})
export class DomainModule {}
