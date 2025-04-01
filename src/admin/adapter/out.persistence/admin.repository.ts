import { AdminEntity } from '../../entity/admin.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(private datasource: DataSource) {
    super(AdminEntity, datasource.createEntityManager());
  }
  async findById(id: string): Promise<AdminEntity | null> {
    return await this.findOne({ where: { id: id } });
  }
  async updateLoginInfo(
    id: string,
    loginAt: Date,
    loginIp: string,
  ): Promise<void> {
    await this.update(id, {
      lastLoginAt: loginAt,
      lastLoginIp: loginIp,
    });
  }
}
