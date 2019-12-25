export class LoggedUser {
  uuid: string;
  username: string;

  constructor(uuid: string, username: string) {
    this.uuid = uuid;
    this.username = username;
  }
}
