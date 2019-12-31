import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from 'src/app/global-models/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUsersListByUuidList(usersUuids: string[]) {
    return this.httpClient.post('/user-api/info/users', usersUuids);
  }

  createNewUser(user: UserDTO) {
    return this.httpClient.post('/user-api/mgmt/users', user);
  }
  
}
