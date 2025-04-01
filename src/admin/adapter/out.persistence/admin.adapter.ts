import { AdminPort } from '../../application/port/out/admin.port';
import { AdminEntity } from '../../entity/admin.entity';
import { AdminRepository } from './admin.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAdapter implements AdminPort {
  constructor(private readonly adminRepository: AdminRepository) {}

  async saveAdmin(adminEntity: AdminEntity): Promise<void> {
    await this.adminRepository.save(adminEntity);
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.adminRepository.count({ where: { id } });
    return count > 0;
  }

  async findById(id: string): Promise<AdminEntity> {
    return await this.adminRepository.findById(id);
  }

  async updateLoginInfo(
    id: string,
    loginAt: Date,
    loginIp: string,
  ): Promise<void> {
    return await this.adminRepository.updateLoginInfo(id, loginAt, loginIp);
  }
}
