import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../adapter/out.persistence/user.repository';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}
  create(createUserDto: CreateUserDto) {
    return this.usersRepository.createUser(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findById(id: number) {
    return this.usersRepository.findById(id);
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
