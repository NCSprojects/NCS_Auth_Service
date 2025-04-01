import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { AdminLoginEvent } from '../admin.login.event';
import { AdminPort } from '../../application/port/out/admin.port';

@Injectable()
export class AdminLoginListener {
  constructor(
    @Inject('AdminPort')
    private readonly adminPort: AdminPort,
  ) {}

  @OnEvent('admin.logged-in')
  async handle(event: AdminLoginEvent): Promise<void> {
    await this.adminPort.updateLoginInfo(event.id, event.timestamp, event.ip);
  }
}
