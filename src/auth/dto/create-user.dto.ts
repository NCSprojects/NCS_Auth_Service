export class CreateUserDto {
  randomId: number;
  preRev: boolean;
  adCnt: number;
  cdCnt: number;
  regDt: string;
  constructor(
    randomId?: number,
    preRev?: boolean,
    adCnt?: number,
    cdCnt?: number,
    regDt?: string,
  ) {
    // If no arguments are provided, set default values
    this.randomId = randomId ?? 0; // Default to 0 if no value is provided
    this.preRev = preRev ?? false; // Default to false if no value is provided
    this.adCnt = adCnt ?? 0; // Default to 0 if no value is provided
    this.cdCnt = cdCnt ?? 0; // Default to 0 if no value is provided
    this.regDt = regDt ?? new Date().toDateString(); // Default to the current date if no value is provided
  }
}
