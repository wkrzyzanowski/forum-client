import { Component, OnInit } from "@angular/core";
import { LoginService } from "./../global-services/login-service/login-service.service";
import { HttpResponse } from "@angular/common/http";
import { AuthResponse } from "../global-services/AuthResponse";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { LoggedUser } from "../global-services/LoggedUser";

@Component({
  selector: "login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  loginError: boolean = false;
  username: string;
  password: string;

  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {}

  login() {
    this.loginService.getTokenAndUser(this.username, this.password).subscribe(
      (response: HttpResponse<AuthResponse>) => {
        this.cookieService.set("username", response.body.username);
        this.cookieService.set("uuid", response.body.uuid);
        this.cookieService.set("jwt", response.headers.get("authorization"));
        this.loginService.loggedUser = new LoggedUser(
          response.body.uuid,
          response.body.username
        );
        this.router.navigateByUrl("/topics");
      },
      error => {
        this.loginError = true;
      }
    );
  }

  loginOnClick(event) {
    this.login();
  }
}
