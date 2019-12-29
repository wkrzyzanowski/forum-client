import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { LoginService } from "./../login-service/login-service.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes("/auth/login")) {
      return this.continueRequest(next, req);
    } else {
      if (this.cookieService.check("jwt")) {
        const token: string = this.cookieService.get("jwt");

        req = req.clone({ headers: req.headers.set("Authorization", token) });

        return this.continueRequest(next, req);
      } else {
        this.loginService.logOutCurrentUser();
        this.router.navigateByUrl("/login");
      }
    }

    return null;
  }

  private continueRequest(
    next: HttpHandler,
    req: HttpRequest<any>
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log("event--->>>", event);
        }
        return event;
      })
    );
  }
}
