export interface CreateReservationRequest {
  userId: string;
  contentScheduleId: number;
  adCnt: number;
  cdCnt: number;
}

export interface CreateReservationResponse {
  success: boolean;
  message: string;
}
