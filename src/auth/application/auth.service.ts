import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { AuthReservationAdapter } from '../adapter/out.external/auth.ReservationAdapter';
import { CreateReservationRequest } from '../domain/interface/resevationInterface';
import { JwtTokenService } from '../../common/token.service';

/*
 *
 * 인증 코드를 nosql을 통해 log 형식으로 저장 검증시에는 해당 인증코드가 발급한 코드인지 시간은 유효한지를 체크
 * 예상 저장 방식 : Id: generate Value , randomId: id값, createdAt : date
 * */
@Injectable()
export class AuthService implements RegisterUsecase {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject('AuthLoadAuth') private readonly authLoadAuth: AuthLoadAuth,
    @Inject('AuthSaveAuth') private readonly authSaveAuth: AuthSaveAuth,
    @Inject('AuthLoadAuthInfo')
    private readonly authAuthInfoAdapter: AuthLoadAuthInfo,
    @Inject('AuthSaveAuthInfo')
    private readonly authSaveAuthInfoAdapter: AuthSaveAuthInfo,
    private readonly authMapper: AuthMapper,
    private readonly authUserServiceAdapter: AuthUserServiceAdapter,
    private readonly authReservationAdapter: AuthReservationAdapter,
  ) {}

  reservationPreReservation(reservationDto: CreateReservationRequest) {
    return this.authReservationAdapter.CreateReservation(reservationDto);
  }

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
      requestDto.visitors,
      requestDto.guardians,
      requestDto.isReserved,
      requestDto.isManual,
      requestDto.scheduleId,
    );
    return createRandomNumDto;
  }

  async generateAuth(
    randomId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { randomId };

    const accessToken = await this.jwtTokenService.generateAccessToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);
    this.authSaveAuthInfoAdapter.setExInfo(
      refreshToken,
      randomId.toString(),
      3600,
    );
    return { accessToken, refreshToken };
  }
  async validateAuth(
    jwtToken: string,
  ): Promise<{ valid: boolean; id?: string; isAdmin?: boolean }> {
    try {
      // JWT 검증
      const decoded = await this.jwtTokenService.verifyToken(jwtToken);
      if (decoded && decoded.randomId) {
        return { valid: true, id: decoded.randomId, isAdmin: false };
      }
      // 2025-05-16 추가
      else if (decoded && decoded.adminId && decoded.role) {
        return { valid: true, id: decoded.adminId, isAdmin: true };
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
      authCodes[0].manuYn,
      authCodes[0].adCnt,
      authCodes[0].cdCnt,
      authCodes[0].createdAt.toISOString(), // 시 분 초까지
    );
    return authCodes[0].preRev == true
      ? new ChkNumDto(codeValid, createUserDto, authCodes[0].scheduleId)
      : new ChkNumDto(codeValid, createUserDto);
  }

  // refresh token 검증
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
