import { Observable } from 'rxjs';
import { UserInterface } from '../../../domain/interface/userInterface';
import { FindUserInterface } from '../../../domain/interface/findUserInterface';

export interface UserService {
  CreateUser(data: UserInterface): Observable<UserInterface>;
  FindById(randomId: FindUserInterface): Observable<UserInterface>;
}
