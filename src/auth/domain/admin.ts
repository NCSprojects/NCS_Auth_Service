import { AdminRole } from './admin.role';
import * as bcrypt from 'bcrypt';

export class Admin {
  constructor(
    public readonly id: string,
    private passwordHash: string,
    public role: AdminRole,
  ) {}

  static validateRole(role: string) {
    if (!Object.values(AdminRole).includes(role as AdminRole)) {
      throw new Error('유효하지 않은 역할입니다.');
    }
  }

  static async createWithPlainPassword(
    id: string,
    plainPassword: string,
    role: AdminRole,
  ): Promise<Admin> {
    this.validateRole(role);
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    return new Admin(id, passwordHash, role);
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.passwordHash);
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }
}
