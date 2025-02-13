import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthCodeEntity, AuthCodeSchema } from './schema/auth-code.schema';

import { AuthMapper } from './mapper/auth.mapper';
import { AuthAuthCodePersistenceAdapter } from './adapter/out.persistence/auth.authCodePersistenceAdapter';
import { AuthController } from './adapter/in.web/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthCodeRepository } from './adapter/out.persistence/auth.repository';
import { RedisRepository } from './adapter/out.persistence/auth.redis.repository';
import { AuthAuthInfoAdapter } from './adapter/out.persistence/auth.authInfoAdapter';
import { AuthUserServiceAdapter } from './adapter/out.external/auth.UserServiceAdapter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthGrpcController } from './adapter/in.web/auth.grpcController';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '5m' }, // JWT의 만료 시간 설정
    }),
    MongooseModule.forFeature([
      { name: AuthCodeEntity.name, schema: AuthCodeSchema },
    ]),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, '..', 'proto', 'user.proto'),
          url: process.env.GRPC_URL,
        },
      },
    ]),
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [
    {
      provide: 'RegisterUsecase',
      useClass: AuthService,
    },
    AuthCodeRepository,
    RedisRepository,
    AuthMapper,
    {
      provide: 'AuthLoadAuth',
      useClass: AuthAuthCodePersistenceAdapter,
    },
    {
      provide: 'AuthSaveAuth',
      useClass: AuthAuthCodePersistenceAdapter,
    },
    {
      provide: 'AuthLoadAuthInfo',
      useClass: AuthAuthInfoAdapter,
    },
    {
      provide: 'AuthSaveAuthInfo',
      useClass: AuthAuthInfoAdapter,
    },
    AuthUserServiceAdapter,
  ],
  // exports: [AuthService],
})
export class AuthModule {}
