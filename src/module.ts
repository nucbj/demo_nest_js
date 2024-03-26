import { Module } from '@nestjs/common';
import { DomainModule } from 'src/domain/module';
import { CodeInterceptor } from 'src/conf/interceptor/codeInterceptor';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CodeInterceptor,
    },
  ],
  imports: [DomainModule, ConfigModule.forRoot()],
})
export class MainModule {}
