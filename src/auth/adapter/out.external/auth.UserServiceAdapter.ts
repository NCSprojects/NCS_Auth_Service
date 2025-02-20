import { UserPort } from '../../application/port/out/auth.userPort';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './interface/UserServiceClient';
import { UserInterface } from 'src/auth/domain/interface/userInterface';
import { lastValueFrom, Observable } from 'rxjs';
import { FindUserInterface } from '../../domain/interface/findUserInterface';

@Injectable()
export class AuthUserServiceAdapter implements UserPort, OnModuleInit {
  private userServiceClient: UserService;

  constructor(
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc, // gRPC 클라이언트 주입
  ) {}

  onModuleInit() {
    this.userServiceClient = this.client.getService<UserService>('UserService');
    console.log('UserService:', this.userServiceClient); // 로그로 확인
  }

  async createUser(user: UserInterface) {
    // gRPC 메서드 호출 (Observable 반환)
    const resultUser$: Observable<UserInterface> =
      this.userServiceClient.CreateUser(user);
    const result = await lastValueFrom(resultUser$);
    return result;
    // // 여기서 subscribe를 호출해야 실제 RPC 요청이 전송됩니다.
    // resultUser$.subscribe({
    //   next: (res) => {
    //     return res;
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    //   complete: () => {},
    // });
  }

  async findById(randomId: FindUserInterface) {
    const resultUser$: Observable<UserInterface> =
      this.userServiceClient.FindById(randomId);

    const result = await lastValueFrom(resultUser$);
    return result;
  }
}
