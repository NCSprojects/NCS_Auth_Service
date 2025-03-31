import { AdminRole } from '../domain/admin.role';
import { IsEnum } from 'class-validator';
export class AdminRegisterDto {
  public readonly id: string;
  @IsEnum(AdminRole, { message: '올바르지 않은 역할입니다.' })
  public readonly role: AdminRole;
  private readonly password: string;

  constructor(id: string, password: string, role: AdminRole) {
    this.id = id;
    this.password = password;
    this.role = role;
  }

  getPassword(): string {
    return this.password;
  }
}
