import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUsecase } from './port/in/auth.registerUseCase';
import { CreateRandomNumDto } from '../dto/create-random-num-dto';
import { AuthCode } from '../domain/auth';
import { AuthMapper } from '../mapper/auth.mapper';
import { AuthUserServiceAdapter } from '../adapter/out.external/auth.UserServiceAdapter';
import { UserInterface } from '../domain/interface/userInterface';
import { FindUserInterface } from '../domain/interface/findUserInterface';
import { CreateRandomNumRequestDto } from '../dto/create-random-num-request-dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { ChkNumDto } from '../dto/chk-num-dto';
import { AuthLoadAuthInfo } from './port/out/auth.loadAuthInfo';
import { AuthSaveAuthInfo } from './port/out/auth.saveAuthInfo';
import { AuthSaveAuth } from './port/out/auth.saveAuth';
import { AuthLoadAuth } from './port/out/auth.loadAuth';

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
    @Inject('AuthLoadAuth') private readonly authLoadAuth: AuthLoadAuth,
    @Inject('AuthSaveAuth') private readonly authSaveAuth: AuthSaveAuth,
    @Inject('AuthLoadAuthInfo')
    private readonly authAuthInfoAdapter: AuthLoadAuthInfo,
    @Inject('AuthSaveAuthInfo')
    private readonly authSaveAuthInfoAdapter: AuthSaveAuthInfo,
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
  generateRandomCode(
    requestDto: CreateRandomNumRequestDto,
  ): CreateRandomNumDto {
    const authCode: AuthCode = new AuthCode();
    authCode.generateRandomCode();

    const createRandomNumDto = this.authMapper.toDtoFromDomain(authCode);

    this.authSaveAuth.createAuthCode(
      createRandomNumDto.code,
      createRandomNumDto.createdAt,
      requestDto.guardians,
      requestDto.visitors,
      requestDto.isReserved,
      requestDto.observationTime,
    );
    return createRandomNumDto;
  }

  // access token 생성
  async generateJwt(randomId: string): Promise<string> {
    const payload = { randomId };
    return this.jwtService.signAsync(payload, { expiresIn: '5m' }); // access token, 5분 동안 유효
  }

  // refresh token 생성
  async generateRefreshToken(randomId: string): Promise<string> {
    const payload = { randomId };
    return this.jwtService.signAsync(payload, { expiresIn: '7d' }); // refresh token, 7일 동안 유효
  }
  // access token과 refresh token을 함께 반환
  async generateAuth(
    randomId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateJwt(randomId);
    const refreshToken = await this.generateRefreshToken(randomId);
    this.authSaveAuthInfoAdapter.setExInfo(
      refreshToken,
      randomId.toString(),
      3600,
    );
    return { accessToken, refreshToken };
  }
  async validateAuth(
    jwtToken: string,
  ): Promise<{ valid: boolean; id?: string }> {
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
  async verifyAuthCode(randomId: string): Promise<ChkNumDto> {
    this.logger.log(`Starting verification for randomId: ${randomId}`);
    const authCodes = await this.authLoadAuth.findAuthCodeByRandomId(randomId);

    if (!authCodes || authCodes.length === 0) {
      this.logger.warn(`No auth codes found for randomId: ${randomId}`);
      return new ChkNumDto(false, new CreateUserDto()); // 인증 코드가 없으면 유효하지 않음
    }

    // 배열에서 첫 번째 인증 코드만 검사
    const authCodeEntity = authCodes[0];
    const authCode = this.authMapper.toDomainFromEntity(authCodeEntity);
    const codeValid = authCode.isCodeValid(authCode); // 유효성 검사
    const createUserDto = new CreateUserDto(
      authCodes[0].randomId,
      authCodes[0].preRev,
      authCodes[0].adCnt,
      authCodes[0].cdCnt,
      authCodes[0].createdAt.toDateString(),
    );
    return authCodes[0].preRev == true
      ? new ChkNumDto(codeValid, createUserDto, authCodes[0].scheduleTime)
      : new ChkNumDto(codeValid, createUserDto);
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ valid: boolean; id?: string }> {
    const result = await this.authAuthInfoAdapter.getInfo(refreshToken);
    /*token이 있으면 true 아니면 false*/
    if (result) {
      // token이 있으면 { valid: true, id: result.id } 반환
      return { valid: true, id: result };
    }
    // token이 없으면 { valid: false } 반환
    return { valid: false };
  }
}
