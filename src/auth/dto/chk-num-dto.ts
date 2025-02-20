import { CreateUserDto } from './create-user.dto';

export class ChkNumDto {
  chkval: boolean;
  scheduleId?: number | null;
  dto: CreateUserDto;

  constructor(chkval: boolean, dto: CreateUserDto, scheduleId?: number) {
    this.chkval = chkval;
    this.scheduleId = scheduleId ?? 0; // 기본값 설정
    this.dto = dto;
  }
}
