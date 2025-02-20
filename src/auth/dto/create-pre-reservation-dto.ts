export class CreatePreReservationDto {
  userId: string;
  contentScheduleId: number;
  adCnt: number;
  cdCnt: number;

  constructor(
    userId: string,
    contentScheduleId: number,
    adCnt: number,
    cdCnt: number,
  ) {
    this.userId = userId;
    this.contentScheduleId = contentScheduleId;
    this.adCnt = adCnt;
    this.cdCnt = cdCnt;
  }
}
