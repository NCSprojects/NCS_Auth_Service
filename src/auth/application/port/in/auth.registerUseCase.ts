import { CreateRandomNumDto } from '../../../dto/create-random-num-dto';
import { UserInterface } from '../../../domain/interface/userInterface';
import { FindUserInterface } from '../../../domain/interface/findUserInterface';
import { CreateRandomNumRequestDto } from '../../../dto/create-random-num-request-dto';
import { ChkNumDto } from '../../../dto/chk-num-dto';
//dto로 바꾸기
export interface RegisterUsecase {
  generateRandomCode(
    createRequestDto: CreateRandomNumRequestDto,
  ): CreateRandomNumDto;
  verifyAuthCode(randomId: number): Promise<ChkNumDto>;
  generateAuth(
    randomId: number,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  validateAuth(jwtToken: string): Promise<{ valid: boolean; id?: number }>;
  validateRefreshToken(refreshToken: string);
  createUser(userDto: UserInterface);
  findUserById(randomId: FindUserInterface);
}
