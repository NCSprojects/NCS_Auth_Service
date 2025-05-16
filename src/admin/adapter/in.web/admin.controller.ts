import { AdminLoginUsecase } from '../../application/port/in/admin.login.usecase';
import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { AdminRegisterUsecase } from '../../application/port/in/admin.register.usecase';
import { AdminRegisterDto } from '../../dto/admin-register.dto';
import { AdminLoginDto } from '../../dto/admin-login.dto';
import { Request as Request } from 'express';

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
    return this.registerUsecase.register(adminRegisterDto);
  }

  @Post('login')
  async login(
    @Body() adminLoginDto: AdminLoginDto,
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    adminLoginDto.ip = ip?.toString() ?? '';
    return await this.loginUsecase.login(adminLoginDto);
  }
}
