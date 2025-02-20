import { ReservationPort } from '../../application/port/out/auth.reservationPort';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ReservationService } from './interface/ReservationServiceClient';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateReservationRequest,
  CreateReservationResponse,
} from '../../domain/interface/resevationInterface';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class AuthReservationAdapter implements ReservationPort, OnModuleInit {
  private reservationServiceClient: ReservationService;

  constructor(
    @Inject('RESERVATION_PACKAGE') private readonly client: ClientGrpc, // gRPC 클라이언트 주입
  ) {}

  onModuleInit() {
    this.reservationServiceClient =
      this.client.getService<ReservationService>('ReservationService');
  }

  async CreateReservation(reservation: CreateReservationRequest) {
    const resultReservation$: Observable<CreateReservationResponse> =
      this.reservationServiceClient.CreateReservation(reservation);

    const result = await lastValueFrom(resultReservation$);
    return result;
  }
}
