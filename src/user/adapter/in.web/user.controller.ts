import {
  Controller,
  Get,
  Post,
  Body,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Patch,
  Param,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Delete,
} from '@nestjs/common';
import { UserService } from '../../application/user.service';
import { CreateUserDto } from '../../../auth/dto/create-user.dto';
import { User } from '../../entities/user.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @Get('verify/:id')
  async verifyOne(@Param('id') id: string) {
    const user: User = await this.userService.findById(+id);
    return { valid: !!user };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
