import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RegisterUsecase } from '../../application/port/in/auth.registerUseCase';
import { CreateRandomNumDto } from '../../dto/create-random-num-dto';
import { UserInterface } from '../../domain/interface/userInterface';

//rt 재발급 짜기
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('RegisterUsecase')
    private readonly registerUsecase: RegisterUsecase,
  ) {}

  // 랜덤 6자리 숫자 생성
  @Get('generate')
  async generateRandom6Digit(): Promise<CreateRandomNumDto> {
    return this.registerUsecase.generateRandomCode();
  }

  @Post('register')
  async register(@Body() createUserDto: UserInterface): Promise<any> {
    const chkVal: boolean = await this.registerUsecase.verifyAuthCode(
      createUserDto.randomId,
    );
    if (chkVal) {
      const newVar = await this.registerUsecase.createUser(createUserDto);
      console.log(newVar);
      return this.registerUsecase.generateAuth(createUserDto.randomId);
    } else {
      return {
        message: 'Invalid verification code',
      };
    }
  }
  @Post('validate/token')
  async validateToken(@Body('token') token: string): Promise<boolean> {
    // JWT 토큰 검증
    const chkVal: { valid: boolean; id?: number } =
      await this.registerUsecase.validateAuth(token);
    // 토큰이 유효한 경우 service로 빼기
    if (chkVal.valid) {
      // id 값으로 사용자 조회
      const chkUser: UserInterface = await this.registerUsecase.findUserById({
        randomId: chkVal.id,
      });
      //사용자가 존재하면 true, 없으면 false 반환
      return chkUser ? true : false;
    }
    // 토큰이 유효하지 않으면 false 반환
    return false;
  }

  // @Post('reissue')
}
