import { AuthCodeDocument } from '../../../schema/auth-code.schema';

export interface AuthSaveAuth {
  createAuthCode(
    randomId: number,
    createdAt: Date,
    visitors: number,
    guardians: number,
    isReserved: boolean,
    observationTime: Date,
  ): Promise<AuthCodeDocument>;
  deleteAuthCode(randomId: number, createdAt: Date): Promise<boolean>;
}
