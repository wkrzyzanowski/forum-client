import { Component, OnInit, SimpleChanges, Input } from "@angular/core";
import { LoginService } from "../global-services/http-services/login-service/login-service.service";
import { AuthResponse } from "../global-services/http-services/login-service/AuthResponse";
import { BehaviorSubject } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { LoggedUser } from "../global-models/LoggedUser";

@Component({
  selector: "header-bar",
  templateUrl: "./header-bar.component.html",
  styleUrls: ["./header-bar.component.css"]
})
export class HeaderBarComponent implements OnInit {
  loggedUser: LoggedUser;

  constructor(
    private loginService: LoginService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {}

  logout() {
    this.loginService.logOutCurrentUser();
  }

  isLogged(): boolean {
    return this.loginService.loggedIn;
  }

  getUsername(): string {
    return this.cookieService.get("username");
  }

  getUuid(): string {
    return this.cookieService.get("uuid");
  }
}
