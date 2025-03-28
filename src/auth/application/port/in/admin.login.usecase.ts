import { AdminLoginDto } from '../../../dto/admin-login.dto';

export interface AdminLoginUsecase {
  login(
    dto: AdminLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
