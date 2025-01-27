import { CreateRandomNumDto } from '../../../dto/create-random-num-dto';
import { UserInterface } from '../../../domain/interface/userInterface';
import { FindUserInterface } from '../../../domain/interface/findUserInterface';
//dto로 바꾸기
export interface RegisterUsecase {
  generateRandomCode(): CreateRandomNumDto;
  verifyAuthCode(randomId: number): Promise<boolean>;
  generateAuth(
    randomId: number,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  validateAuth(jwtToken: string): Promise<{ valid: boolean; id?: number }>;
  validateRefreshToken(refreshToken: string);
  createUser(userDto: UserInterface);
  findUserById(randomId: FindUserInterface);
}
