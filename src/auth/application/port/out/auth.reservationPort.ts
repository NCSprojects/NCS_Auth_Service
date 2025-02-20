import { CreateReservationRequest } from '../../../domain/interface/resevationInterface';

export interface ReservationPort {
  CreateReservation(reservation: CreateReservationRequest);
}
