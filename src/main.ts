import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // // AuthService의 gRPC 서버
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'auth',
  //     protoPath: join(__dirname, './proto/auth.proto'),
  //     url: '0.0.0.0:50052', // AuthService의 gRPC 서버 주소
  //   },
  // });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
