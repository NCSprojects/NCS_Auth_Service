import { AuthCodeDocument } from '../../../schema/auth-code.schema';

export interface AuthLoadAuth {
  findAuthCodeByRandomId(randomId: number): Promise<AuthCodeDocument[]>;
  findAuthCode(
    randomId: number,
    createdAt: Date,
  ): Promise<AuthCodeDocument | null>;
}
