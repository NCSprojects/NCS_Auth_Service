import { AuthCodeDocument } from '../../../schema/auth-code.schema';

export interface AuthSaveAuth {
  createAuthCode(randomId: number, createdAt: Date): Promise<AuthCodeDocument>;
  deleteAuthCode(randomId: number, createdAt: Date): Promise<boolean>;
}
