import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AdminRole } from '../domain/admin.role';

@Entity('ADMINS')
export class AdminEntity {
  @PrimaryColumn('varchar', { name: 'ADMIN_ID', length: 15 })
  id: string;

  @Column('varchar', { name: 'PASSWORD' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    name: 'ROLE',
  })
  role: AdminRole;

  @Column('datetime', { name: 'CREATED_AT' })
  createdAt: Date;

  @Column('datetime', { name: 'LAST_LOGIN_AT', nullable: true })
  lastLoginAt: Date;

  @Column('varchar', { name: 'LAST_LOGIN_IP', nullable: true })
  lastLoginIp: string;
}
