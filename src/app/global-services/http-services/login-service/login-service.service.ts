import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthResponse } from './AuthResponse';
import { LoggedUser } from '../../../global-models/LoggedUser';
import { UserDTO } from '../../../global-models/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loggedIn = false;
  loggedUser: LoggedUser = new LoggedUser('empty', 'empty');

  constructor(
    private httpService: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      if (this.cookieService.check('jwt')) {
        const token: string = this.cookieService.get('jwt');

        if (this.isTokenExpired(token)) {
          this.loggedIn = false;
        } else {
          this.loggedIn = true;
        }
      } else {
        this.loggedIn = false;
      }

      resolve(this.loggedIn);
    });
  }

  logOutCurrentUser() {
    this.cookieService.deleteAll();
    this.loggedUser = undefined;
    this.loggedIn = false;
    this.router.navigateByUrl('/login');
  }

  getTokenAndUser(login: string, pass: string) {
    return this.httpService.post(
      '/user-api/auth/login',
      {
        username: login,
        password: pass
      },
      { observe: 'response' }
    );
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.cookieService.get('jwt');
    }
    if (!token) {
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }
}
