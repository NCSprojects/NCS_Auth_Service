import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUsecase } from '../../application/port/in/auth.registerUseCase';
import { CreateRandomNumDto } from '../../dto/create-random-num-dto';
import { UserInterface } from '../../domain/interface/userInterface';
import { CreateRandomNumRequestDto } from '../../dto/create-random-num-request-dto';
import { CreatePreReservationDto } from '../../dto/create-pre-reservation-dto';

//rt 재발급 짜기
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('RegisterUsecase')
    private readonly registerUsecase: RegisterUsecase,
  ) {}

  // 랜덤 6자리 숫자 생성
  @Post('code')
  async generateRandom6Digit(
    @Body() createRandomNumRequest: CreateRandomNumRequestDto,
  ): Promise<CreateRandomNumDto> {
    return this.registerUsecase.generateRandomCode(createRandomNumRequest);
  }

  @Post('verify')
  async register(@Body('randomId') randomId: string): Promise<any> {
    const verifyValue = await this.registerUsecase.verifyAuthCode(randomId);
    if (verifyValue.chkval) {
      const newVar = await this.registerUsecase.createUser(verifyValue.dto);
      if (verifyValue.scheduleId != 0) {
        const newSchedule = new CreatePreReservationDto(
          newVar.randomId,
          verifyValue.scheduleId,
          newVar.adCnt,
          newVar.cdCnt,
        );
        this.registerUsecase.reservationPreReservation(newSchedule);
      }
      return this.registerUsecase.generateAuth(randomId);
    } else {
      return {
        message: 'Invalid verification code',
      };
    }
  }
  @Post('validate/token')
  async validateToken(@Body('token') token: string): Promise<boolean> {
    // JWT 토큰 검증
    const chkVal: { valid: boolean; id?: string } =
      await this.registerUsecase.validateAuth(token);
    // 토큰이 유효한 경우 service로 빼기
    if (chkVal.valid) {
      // id 값으로 사용자 조회
      const chkUser: UserInterface = await this.registerUsecase.findUserById({
        randomId: chkVal.id,
      });
      //사용자가 존재하면 true, 없으면 false 반환
      return !!chkUser;
    }
    // 토큰이 유효하지 않으면 false 반환
    return false;
  }

  @Post('verify/header')
  async verifyTokenFromHeader(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    // "Bearer " 부분 제거 후 JWT 토큰 추출
    const token = authHeader.replace('Bearer ', '').trim();

    // JWT 검증 및 ID 추출
    const chkVal: { valid: boolean; id?: string } =
      await this.registerUsecase.validateAuth(token);

    if (!chkVal.valid || !chkVal.id) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return { userId: chkVal.id };
  }

  // AT 및 RT 재발급
  @Post('reissue')
  async reissueAccessToken(@Body('refreshToken') token: string) {
    // JWT 토큰 검증
    const chkVal: { valid: boolean; id?: string } =
      await this.registerUsecase.validateRefreshToken(token);
    if (chkVal.valid) {
      // id 값으로 사용자 조회
      const chkUser: UserInterface = await this.registerUsecase.findUserById({
        randomId: chkVal.id,
      });
      return this.registerUsecase.generateAuth(chkUser.randomId);
    }
  }
}
