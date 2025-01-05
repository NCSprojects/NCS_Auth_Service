import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateRandomNumDto } from './dto/create-random-num-dto';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
//rt 재발급 짜기
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 랜덤 6자리 숫자 생성
  @Get('generate')
  async generateRandom6Digit(): Promise<CreateRandomNumDto> {
    return this.authService.generateRandomCode();
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    const chkVal: boolean = await this.authService.verifyAuthCode(
      createUserDto.id,
    );
    if (chkVal) {
      await this.userService.create(createUserDto);
      return this.authService.generateTokens(createUserDto.id);
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
      await this.authService.validateJwtToken(token);
    // 토큰이 유효한 경우
    if (chkVal.valid) {
      // id 값으로 사용자 조회
      const chkUser: User = await this.userService.findById(chkVal.id);
      // 사용자가 존재하면 true, 없으면 false 반환
      return chkUser ? true : false;
    }
    // 토큰이 유효하지 않으면 false 반환
    return false;
  }

  // @Post('reissue')
}
