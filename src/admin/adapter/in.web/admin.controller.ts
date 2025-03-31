import { AdminLoginUsecase } from '../../application/port/in/admin.login.usecase';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AdminRegisterUsecase } from '../../application/port/in/admin.register.usecase';
import { AdminRegisterDto } from '../../dto/admin-register.dto';
import { AdminLoginDto } from '../../dto/admin-login.dto';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject('AdminRegisterUsecase')
    private readonly registerUsecase: AdminRegisterUsecase,
    @Inject('AdminLoginUsecase')
    private readonly loginUsecase: AdminLoginUsecase,
  ) {}

  @Post('')
  async register(@Body() adminRegisterDto: AdminRegisterDto): Promise<any> {
    return await this.registerUsecase.register(adminRegisterDto);
  }

  @Post('login')
  async login(
    @Body() adminLoginDto: AdminLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.loginUsecase.login(adminLoginDto);
  }
}
