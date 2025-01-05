import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { CreateRandomNumDto } from './dto/create-random-num-dto';
import { AuthCodeRepository } from './auth.repository';
import { AuthCodeDocument } from './schema/auth-code.schema';
import { RedisRepository } from './auth.redis.repository';
/*
 *
 * 인증 코드를 nosql을 통해 log 형식으로 저장 검증시에는 해당 인증코드가 발급한 코드인지 시간은 유효한지를 체크
 * 예상 저장 방식 : Id: generate Value , randomId: id값, createdAt : date
 * */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authCodeRepository: AuthCodeRepository,
    private readonly redisRepository: RedisRepository,
  ) {}

  // 랜덤 코드 생성 함수
  generateRandomCode(): CreateRandomNumDto {
    const code: number = crypto.randomInt(100000, 999999); // 6자리 랜덤 번호
    const verificationCodeTime: number = Date.now();
    const createRandomNumDto = new CreateRandomNumDto();
    createRandomNumDto.code = code;
    createRandomNumDto.createdAt = new Date(verificationCodeTime);

    // MongoDB에 인증 코드 저장
    this.authCodeRepository.createAuthCode(
      code,
      new Date(verificationCodeTime),
    );

    return createRandomNumDto;
  }

  // access token 생성
  async generateJwt(randomId: number): Promise<string> {
    const payload = { randomId };
    return this.jwtService.signAsync(payload, { expiresIn: '5m' }); // access token, 5분 동안 유효
  }

  // refresh token 생성
  async generateRefreshToken(randomId: number): Promise<string> {
    const payload = { randomId };
    return this.jwtService.signAsync(payload, { expiresIn: '7d' }); // refresh token, 7일 동안 유효
  }
  // access token과 refresh token을 함께 반환
  async generateTokens(
    randomId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateJwt(randomId);
    const refreshToken = await this.generateRefreshToken(randomId);
    await this.redisRepository.setEx(refreshToken, randomId.toString(), 120);
    return { accessToken, refreshToken };
  }
  async validateJwtToken(
    jwtToken: string,
  ): Promise<{ valid: boolean; id?: number }> {
    try {
      // JWT 검증
      const decoded = await this.jwtService.verifyAsync(jwtToken);
      if (decoded && decoded.id) {
        return { valid: true, id: decoded.id };
      }
    } catch {
      return { valid: false };
    }
    return { valid: false };
  }
  // 인증 코드 검증
  async verifyAuthCode(randomId: number): Promise<boolean> {
    const authCodes =
      await this.authCodeRepository.findAuthCodeByRandomId(randomId);

    if (!authCodes || authCodes.length === 0) {
      return false; // 인증 코드가 없으면 유효하지 않음
    }

    // 배열에서 첫 번째 인증 코드만 검사
    const authCode = authCodes[0];
    return this.isCodeValid(authCode); // 유효성 검사
  }

  // 인증 코드 유효성 검사 (예: 5분 이내 유효)
  private isCodeValid(authCode: AuthCodeDocument): boolean {
    const expirationTime = 5 * 60 * 1000; // 5분
    const elapsedTime = new Date().getTime() - authCode.createdAt.getTime();
    return elapsedTime < expirationTime;
  }
}
