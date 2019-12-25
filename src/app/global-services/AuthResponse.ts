export class AuthResponse {
  uuid: string;
  username: string;
  roles: string[];

  constructor(
    uuid?: string,
    username: string = "Logged User",
    roles?: string[]
  ) {
    this.uuid = uuid;
    this.username = username;
  }
}
