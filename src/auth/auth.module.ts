import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthCodeRepository } from './auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCode, AuthCodeSchema } from './schema/auth-code.schema';
import { RedisRepository } from './auth.redis.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: 'YTRmZWFjYWNmYjFkY2FkZWYxY2RkYmFkY2FkZmQwZjM0Zjd', // JWT를 서명할 비밀키 test key
      signOptions: { expiresIn: '5m' }, // JWT의 만료 시간 설정
    }),
    MongooseModule.forFeature([
      { name: AuthCode.name, schema: AuthCodeSchema },
    ]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthCodeRepository, RedisRepository],
  exports: [AuthService],
})
export class AuthModule {}
