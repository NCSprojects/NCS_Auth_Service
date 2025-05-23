// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminEntity } from './entity/admin.entity';
import { AdminController } from './adapter/in.web/admin.controller';
import { AdminService } from './application/admin.service';
import { AdminAdapter } from './adapter/out.persistence/admin.adapter';
import { AdminRepository } from './adapter/out.persistence/admin.repository';
import { CommonModule } from '../common/common.module';
import { AdminLoginListener } from './event/listener/admin.login.listener';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), CommonModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminRepository,
    AdminLoginListener,
    {
      provide: 'AdminPort',
      useClass: AdminAdapter,
    },
    {
      provide: 'AdminRegisterUsecase',
      useClass: AdminService,
    },
    {
      provide: 'AdminLoginUsecase',
      useClass: AdminService,
    },
  ],
  exports: ['AdminRegisterUsecase', 'AdminLoginUsecase'],
})
export class AdminModule {}
