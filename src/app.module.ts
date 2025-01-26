import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { eurekaClient } from '../eureka.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_HOST),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  // 애플리케이션이 시작될 때 Eureka에 등록
  async onModuleInit() {
    eurekaClient.start((error) => {
      if (error) {
        console.error('Eureka Client registration failed:', error);
      } else {
        console.log('Eureka Client registration succeeded!');
      }
    });
  }

  async onModuleDestroy() {
    eurekaClient.stop();
  }
}
