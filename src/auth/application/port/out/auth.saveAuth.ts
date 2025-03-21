import { AuthCodeDocument } from '../../../schema/auth-code.schema';

export interface AuthSaveAuth {
  createAuthCode(
    randomId: string,
    createdAt: Date,
    visitors: number,
    guardians: number,
    isReserved: boolean,
    isManual: boolean,
    scheduleId: number,
  ): Promise<AuthCodeDocument>;
  deleteAuthCode(randomId: string, createdAt: Date): Promise<boolean>;
}
