import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { LoginService } from "../login-service/login-service.service";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService
      .isAuthenticated()
      .then((authenticated: boolean) => {
        if (authenticated) {
          if (
            this.cookieService.check("username") &&
            this.cookieService.check("uuid") &&
            this.cookieService.get("username") ===
              this.loginService.loggedUser.username &&
            this.cookieService.get("uuid") === this.loginService.loggedUser.uuid
          ) {
            return true;
          } else {
            this.loginService.loggedIn = false;
            this.router.navigateByUrl("/login");
          }
        } else {
          this.loginService.loggedIn = false;
          this.router.navigateByUrl("/login");
        }
      });
  }
}
