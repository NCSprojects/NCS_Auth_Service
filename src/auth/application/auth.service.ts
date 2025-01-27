import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUsecase } from './port/in/auth.registerUseCase';
import { CreateRandomNumDto } from '../dto/create-random-num-dto';
import { AuthCode } from '../domain/auth';
import { AuthMapper } from '../mapper/auth.mapper';
import { AuthAuthCodePersistenceAdapter } from '../adapter/out.persistence/auth.authCodePersistenceAdapter';
import { AuthAuthInfoAdapter } from '../adapter/out.persistence/auth.authInfoAdapter';
import { AuthUserServiceAdapter } from '../adapter/out.external/auth.UserServiceAdapter';
import { UserInterface } from '../domain/interface/userInterface';
import { FindUserInterface } from '../domain/interface/findUserInterface';

/*
 *
 * 인증 코드를 nosql을 통해 log 형식으로 저장 검증시에는 해당 인증코드가 발급한 코드인지 시간은 유효한지를 체크
 * 예상 저장 방식 : Id: generate Value , randomId: id값, createdAt : date
 * */
@Injectable()
export class AuthService implements RegisterUsecase {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly authAuthCodePersistenceAdapter: AuthAuthCodePersistenceAdapter,
    private readonly authAuthInfoAdapter: AuthAuthInfoAdapter,
    private readonly authMapper: AuthMapper,
    private readonly authUserServiceAdapter: AuthUserServiceAdapter,
  ) {}

  createUser(userDto: UserInterface) {
    return this.authUserServiceAdapter.createUser(userDto);
  }
  findUserById(randomId: FindUserInterface) {
    return this.authUserServiceAdapter.findById(randomId);
  }

  // 랜덤 코드 생성 함수
  generateRandomCode(): CreateRandomNumDto {
    const authCode: AuthCode = new AuthCode();
    authCode.generateRandomCode();

    const createRandomNumDto = this.authMapper.toDtoFromDomain(authCode);

    this.authAuthCodePersistenceAdapter.createAuthCode(
      createRandomNumDto.code,
      createRandomNumDto.createdAt,
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
  async generateAuth(
    randomId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateJwt(randomId);
    const refreshToken = await this.generateRefreshToken(randomId);
    this.authAuthInfoAdapter.setExInfo(refreshToken, randomId.toString(), 120);
    return { accessToken, refreshToken };
  }
  async validateAuth(
    jwtToken: string,
  ): Promise<{ valid: boolean; id?: number }> {
    try {
      // JWT 검증
      const decoded = await this.jwtService.verifyAsync(jwtToken);
      if (decoded && decoded.randomId) {
        return { valid: true, id: decoded.randomId };
      }
    } catch {
      return { valid: false };
    }
    return { valid: false };
  }
  // 인증 코드 검증
  async verifyAuthCode(randomId: number): Promise<boolean> {
    this.logger.log(`Starting verification for randomId: ${randomId}`);
    const authCodes =
      await this.authAuthCodePersistenceAdapter.findAuthCodeByRandomId(
        randomId,
      );

    if (!authCodes || authCodes.length === 0) {
      this.logger.warn(`No auth codes found for randomId: ${randomId}`);
      return false; // 인증 코드가 없으면 유효하지 않음
    }

    // 배열에서 첫 번째 인증 코드만 검사
    const authCodeEntity = authCodes[0];
    const authCode = this.authMapper.toDomainFromEntity(authCodeEntity);
    return authCode.isCodeValid(authCode); // 유효성 검사
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ valid: boolean; id?: number }> {
    const result = await this.authAuthInfoAdapter.getInfo(refreshToken);
    /*token이 있으면 true 아니면 false*/
    if (result) {
      // token이 있으면 { valid: true, id: result.id } 반환
      return { valid: true, id: parseInt(result) };
    }
    // token이 없으면 { valid: false } 반환
    return { valid: false };
  }
}
