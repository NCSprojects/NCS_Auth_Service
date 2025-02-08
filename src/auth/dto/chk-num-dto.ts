import { CreateUserDto } from './create-user.dto';

export class ChkNumDto {
  chkval: boolean;
  dto: CreateUserDto;

  constructor(chkval: boolean, dto: CreateUserDto) {
    this.chkval = chkval;
    this.dto = dto;
  }
}
