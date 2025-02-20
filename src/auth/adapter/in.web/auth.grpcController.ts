import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterUsecase } from '../../application/port/in/auth.registerUseCase';
import { UserInterface } from '../../domain/interface/userInterface';
import { ValidateTokenRequest } from '../../domain/interface/validate.token.request';
import { ValidateTokenResponse } from '../../domain/interface/validate.token.response';

@Controller()
export class AuthGrpcController {
  constructor(
    @Inject('RegisterUsecase')
    private readonly registerUsecase: RegisterUsecase,
  ) {}

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    const token = request.token;
    const response: ValidateTokenResponse = {
      valid: false,
      userId: '',
    };

    const chkVal: { valid: boolean; id?: string } =
      await this.registerUsecase.validateAuth(token);
    // 토큰이 유효한 경우 service로 빼기
    if (chkVal.valid) {
      // id 값으로 사용자 조회
      const chkUser: UserInterface = await this.registerUsecase.findUserById({
        randomId: chkVal.id,
      });
      if (chkUser) {
        response.valid = true;
        response.userId = chkVal.id;
      }
    }
    return response;
  }
}
