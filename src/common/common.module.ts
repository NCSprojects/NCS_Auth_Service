import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './token.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '5m' },
    }),
    RedisModule,
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService, RedisModule],
})
export class CommonModule {}
