import { Module } from '@nestjs/common';
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
import { AuthReservationAdapter } from './adapter/out.external/auth.ReservationAdapter';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
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
      {
        name: 'RESERVATION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'reservation',
          protoPath: join(__dirname, '..', 'proto', 'reservation.proto'),
          url: process.env.RESERVATION_GRPC_URL,
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
    AuthReservationAdapter,
  ],
  // exports: [AuthService],
})
export class AuthModule {}
