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
}
