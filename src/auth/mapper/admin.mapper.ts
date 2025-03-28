import { Admin } from '../domain/admin';
import { AdminEntity } from '../schema/admin.entity';
import { AdminRegisterDto } from '../dto/admin-register.dto';

export class AdminMapper {
  /**
   * DTO → Domain
   */
  static async toDomainFromDto(dto: AdminRegisterDto): Promise<Admin> {
    return await Admin.createWithPlainPassword(
      dto.id,
      dto.getPassword(),
      dto.role,
    );
  }

  /**
   * Entity → Domain
   */
  static toDomain(entity: AdminEntity): Admin {
    return new Admin(entity.id, entity.passwordHash, entity.role);
  }

  /**
   * Domain → Entity
   */
  static toEntity(domain: Admin): AdminEntity {
    const entity = new AdminEntity();
    entity.id = domain.id;
    entity.passwordHash = domain.getPasswordHash();
    entity.role = domain.role;
    entity.createdAt = new Date();
    entity.lastLoginAt = null;
    entity.lastLoginIp = null;

    return entity;
  }
}
