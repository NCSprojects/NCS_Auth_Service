import { AuthCodeDocument } from '../../../schema/auth-code.schema';

export interface AuthSaveAuth {
  createAuthCode(
    randomId: string,
    createdAt: Date,
    visitors: number,
    guardians: number,
    isReserved: boolean,
    observationTime: Date,
  ): Promise<AuthCodeDocument>;
  deleteAuthCode(randomId: string, createdAt: Date): Promise<boolean>;
}
