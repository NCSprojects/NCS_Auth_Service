import { AdminEntity } from '../../../schema/admin.entity';

export interface AdminPort {
  saveAdmin(adminEntity: AdminEntity): void;
  existsById(id: string): Promise<boolean>;
  findById(id: string): Promise<AdminEntity>;
}
