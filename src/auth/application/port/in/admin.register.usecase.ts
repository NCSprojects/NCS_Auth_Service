import { AdminRegisterDto } from '../../../dto/admin-register.dto';

export interface AdminRegisterUsecase {
  register(adminRegisterDto: AdminRegisterDto): void;
}
