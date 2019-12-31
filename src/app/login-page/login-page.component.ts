import { Component, OnInit } from '@angular/core';
import { LoginService } from '../global-services/http-services/login-service/login-service.service';
import { HttpResponse } from '@angular/common/http';
import { AuthResponse } from '../global-services/http-services/login-service/AuthResponse';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoggedUser } from '../global-models/LoggedUser';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  loginError: boolean = false;

  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.loginForm = this.createFormGroup();
  }

  ngOnInit() {}

  login() {
    console.log(this.loginForm);

    const usernameFormControl = this.loginForm.get('email');
    const passwordFormControl = this.loginForm.get('password');

    if (usernameFormControl.valid && passwordFormControl.valid) {
      this.loginService
        .getTokenAndUser(usernameFormControl.value, passwordFormControl.value)
        .subscribe(
          (response: HttpResponse<AuthResponse>) => {
            this.cookieService.set('username', response.body.username);
            this.cookieService.set('uuid', response.body.uuid);
            this.cookieService.set(
              'jwt',
              response.headers.get('authorization')
            );
            this.loginService.loggedUser = new LoggedUser(
              response.body.uuid,
              response.body.username
            );
            this.router.navigateByUrl('/topics');
          },
          error => {
            this.loginError = true;
          }
        );
    }
  }

  signIn() {
    this.router.navigateByUrl('/signin');
  }

  loginOnClick(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  isEmailValid() {
    const usernameFormControl = this.loginForm.get('email');
    if (usernameFormControl.touched) {
      return usernameFormControl.valid;
    } else {
      return true;
    }
  }

  isPasswordValid() {
    const passwordFormControl = this.loginForm.get('password');
    if (passwordFormControl.touched) {
      return passwordFormControl.valid;
    } else {
      return true;
    }
  }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
}
