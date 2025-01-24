import { AuthCodeDocument } from '../../schema/auth-code.schema';
import { AuthLoadAuth } from '../../application/port/out/auth.loadAuth';
import { AuthSaveAuth } from '../../application/port/out/auth.saveAuth';
import { AuthCodeRepository } from './auth.repository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthAuthCodePersistenceAdapter
  implements AuthLoadAuth, AuthSaveAuth
{
  constructor(private readonly authCodeRepository: AuthCodeRepository) {}
  async createAuthCode(
    randomId: number,
    createdAt: Date,
  ): Promise<AuthCodeDocument> {
    return this.authCodeRepository.createAuthCode(randomId, createdAt);
  }
  async findAuthCodeByRandomId(randomId: number): Promise<AuthCodeDocument[]> {
    return await this.authCodeRepository.findAuthCodeByRandomId(randomId);
  }
  async findAuthCode(
    randomId: number,
    createdAt: Date,
  ): Promise<AuthCodeDocument | null> {
    return await this.authCodeRepository.findAuthCode(randomId, createdAt);
  }

  async deleteAuthCode(randomId: number, createdAt: Date): Promise<boolean> {
    return await this.authCodeRepository.deleteAuthCode(randomId, createdAt);
  }
}
