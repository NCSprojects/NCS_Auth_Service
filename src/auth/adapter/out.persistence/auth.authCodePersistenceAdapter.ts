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
    randomId: string,
    createdAt: Date,
    visitors: number,
    guardians: number,
    isReserved: boolean,
    observationTime: Date,
  ): Promise<AuthCodeDocument> {
    return this.authCodeRepository.createAuthCode(
      randomId,
      createdAt,
      visitors,
      guardians,
      isReserved,
      observationTime,
    );
  }
  async findAuthCodeByRandomId(randomId: string): Promise<AuthCodeDocument[]> {
    return await this.authCodeRepository.findAuthCodeByRandomId(randomId);
  }
  async findAuthCode(
    randomId: string,
    createdAt: Date,
  ): Promise<AuthCodeDocument | null> {
    return await this.authCodeRepository.findAuthCode(randomId, createdAt);
  }

  async deleteAuthCode(randomId: string, createdAt: Date): Promise<boolean> {
    return await this.authCodeRepository.deleteAuthCode(randomId, createdAt);
  }
}
