export class CreateUserDto {
  randomId: string;
  preRev: boolean;
  manuYn: boolean;
  adCnt: number;
  cdCnt: number;
  regDt: string;
  constructor(
    randomId?: string,
    preRev?: boolean,
    manuYn?: boolean,
    adCnt?: number,
    cdCnt?: number,
    regDt?: string,
  ) {
    this.randomId = randomId ?? '0';
    this.preRev = preRev ?? false;
    this.manuYn = manuYn ?? false;
    this.adCnt = adCnt ?? 0;
    this.cdCnt = cdCnt ?? 0;
    this.regDt = regDt ?? new Date().toDateString();
  }
}
