import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUsersListByUuidList(usersUuids: string[]) {
    return this.httpClient.post("/user-api/info/users", usersUuids);
  }
}
