import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // AuthService에서 UserService로의 gRPC 클라이언트 연결
  console.log('Proto path:', join(__dirname, './proto/user.proto'));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user', // UserService의 proto 패키지명
      protoPath: join(__dirname, './proto/user.proto'),
      url: '127.0.0.1:50051', // UserService의 gRPC 서버 주소
      loader: {
        // 이거는... 아마도 해당 타입들을 어떤 형식으로 받을지에 대한 정보같다.
        enums: String, // 일단 이렇게 적자.
        objects: true,
        arrays: true,
      },
    },
  });

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
