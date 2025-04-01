import { AdminRegisterUsecase } from './port/in/admin.register.usecase';

import { AdminPort } from './port/out/admin.port';
import { AdminMapper } from '../mapper/admin.mapper';
import { JwtTokenService } from '../../common/token.service';
import { AdminRegisterDto } from '../dto/admin-register.dto';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminLoginUsecase } from './port/in/admin.login.usecase';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminLoginEvent } from '../event/admin.login.event';

@Injectable()
export class AdminService implements AdminRegisterUsecase, AdminLoginUsecase {
  constructor(
    @Inject('AdminPort')
    private readonly adminPort: AdminPort,
    private readonly jwtTokenService: JwtTokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(dto: AdminRegisterDto): Promise<void> {
    const exists = await this.adminPort.existsById(dto.id);
    if (exists) {
      throw new ConflictException('이미 존재하는 관리자입니다.');
    }
    const admin = await AdminMapper.toDomainFromDto(dto);
    const adminEntity = AdminMapper.toEntity(admin);
    this.adminPort.saveAdmin(adminEntity);
  }

  async login(
    dto: AdminLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const adminEntity = await this.adminPort.findById(dto.id);
    const admin = AdminMapper.toDomain(adminEntity);
    const isValid = await admin.verifyPassword(dto.password);

    if (!isValid) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }

    this.eventEmitter.emit(
      'admin.logged-in',
      new AdminLoginEvent(admin.id, dto.ip, new Date()),
    );

    return this.generateAdminTokens(admin.id);
  }

  private async generateAdminTokens(
    adminId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { adminId, role: 'ADMIN' };

    const accessToken = await this.jwtTokenService.generateAccessToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
