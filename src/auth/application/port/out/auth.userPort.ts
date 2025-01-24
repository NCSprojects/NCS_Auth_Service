import { UserInterface } from '../../../domain/interface/userInterface';
import { FindUserInterface } from '../../../domain/interface/findUserInterface';

export interface UserPort {
  createUser(user: UserInterface);
  findById(randomId: FindUserInterface);
}
