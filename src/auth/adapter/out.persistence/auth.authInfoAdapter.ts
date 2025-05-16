import { AuthLoadAuthInfo } from '../../application/port/out/auth.loadAuthInfo';
import { AuthSaveAuthInfo } from '../../application/port/out/auth.saveAuthInfo';
import { RedisRepository } from '../../../common/redis/redis.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthAuthInfoAdapter implements AuthLoadAuthInfo, AuthSaveAuthInfo {
  constructor(private readonly redisRepository: RedisRepository) {}

  setExInfo = (key: string, value: string, time: number): void => {
    this.redisRepository.setEx(key, value, time);
  };
  getInfo(key: string) {
    return this.redisRepository.get(key);
  }
}
