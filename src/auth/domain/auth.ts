export class AuthCode {
  public randomId: number;
  public createdAt: Date;

  constructor() {}

  public isCodeValid(authCode: AuthCode): boolean {
    const expirationTime = 5 * 60 * 1000; // 5분
    const elapsedTime = new Date().getTime() - authCode.createdAt.getTime();
    return elapsedTime < expirationTime;
  }

  // 랜덤 코드 생성 함수
  public generateRandomCode(): this {
    this.randomId = Math.floor(Math.random() * 900000) + 100000; // 6자리 랜덤 번호
    this.createdAt = new Date(Date.now());
    return this; // `randomId`는 외부에서 주입받기 위해 0으로 설정
  }
}
