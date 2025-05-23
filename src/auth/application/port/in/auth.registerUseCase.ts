import { CreateRandomNumDto } from '../../../dto/create-random-num-dto';
import { UserInterface } from '../../../domain/interface/userInterface';
import { FindUserInterface } from '../../../domain/interface/findUserInterface';
import { CreateRandomNumRequestDto } from '../../../dto/create-random-num-request-dto';
import { ChkNumDto } from '../../../dto/chk-num-dto';
import { CreateReservationRequest } from '../../../domain/interface/resevationInterface';
//dto로 바꾸기
export interface RegisterUsecase {
  generateRandomCode(
    createRequestDto: CreateRandomNumRequestDto,
  ): Promise<CreateRandomNumDto>;
  verifyAuthCode(randomId: string): Promise<ChkNumDto>;
  generateAuth(
    randomId: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  validateAuth(
    jwtToken: string,
  ): Promise<{ valid: boolean; id?: string; isAdmin?: boolean }>;
  validateRefreshToken(refreshToken: string);
  createUser(userDto: UserInterface);
  findUserById(randomId: FindUserInterface);
  reservationPreReservation(reservationDto: CreateReservationRequest);
}
