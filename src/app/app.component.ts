import { Component } from "@angular/core";
import { LoginService } from "./global-services/login-service/login-service.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "forum-client";

  constructor(private loginService: LoginService) {}
}
