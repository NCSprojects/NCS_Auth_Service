import { AuthCodeDocument } from '../../../schema/auth-code.schema';

export interface AuthLoadAuth {
  findAuthCodeByRandomId(randomId: string): Promise<AuthCodeDocument[]>;
  findAuthCode(
    randomId: string,
    createdAt: Date,
  ): Promise<AuthCodeDocument | null>;
}
