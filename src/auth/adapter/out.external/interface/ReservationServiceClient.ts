import { Observable } from 'rxjs';
import {
  CreateReservationRequest,
  CreateReservationResponse,
} from '../../../domain/interface/resevationInterface';

export interface ReservationService {
  CreateReservation(
    CreateReservationRequest: CreateReservationRequest,
  ): Observable<CreateReservationResponse>;
}
