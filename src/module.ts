import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/module';
import { AppModule } from 'src/controller_example/module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DomainModule, AppModule, ConfigModule.forRoot()],
})
export class MainModule {}
