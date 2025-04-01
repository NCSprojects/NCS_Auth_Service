import { Expose } from 'class-transformer';

export class AdminLoginDto {
  @Expose({ name: 'id' })
  private readonly _id: string;

  @Expose({ name: 'password' })
  //@MinLength(4)
  private readonly _password: string;
  ip?: string;

  get id(): string {
    return this._id;
  }

  get password(): string {
    return this._password;
  }
}
