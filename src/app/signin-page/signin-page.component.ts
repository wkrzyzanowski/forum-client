import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../global-services/login-service/login-service.service';
import { UserDTO } from '../topic-page/model/UserDTO';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent implements OnInit {
  createNewUserForm: FormGroup;

  isCreationFailure: boolean = false;
  isCreationSuccess: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {
    this.createNewUserForm = this.createFormGroup();
  }

  ngOnInit() {}

  goToLoginPage() {
    this.router.navigateByUrl('login');
  }

  createNewUser() {
    if (
      this.createNewUserForm.get('email').value ===
        this.createNewUserForm.get('emailRepeat').value &&
      this.createNewUserForm.get('password').value ===
        this.createNewUserForm.get('passwordRepeat').value
    ) {
      let newUser: UserDTO = new UserDTO();
      newUser.nick = this.createNewUserForm.get('nick').value;
      newUser.email = this.createNewUserForm.get('email').value;
      newUser.password = this.createNewUserForm.get('password').value;

      this.loginService.createNewUser(newUser).subscribe(
        respo => {
          this.isCreationSuccess = true;
          this.createNewUserForm = this.createFormGroup();
        },
        err => {
          this.isCreationFailure = true;
        }
      );
    }
  }

  isNickValid() {
    const formControl = this.createNewUserForm.get('nick');
    if (formControl.touched) {
      return formControl.valid;
    } else {
      return true;
    }
  }

  isEmailValid() {
    const formControl = this.createNewUserForm.get('email');
    if (formControl.touched) {
      return formControl.valid;
    } else {
      return true;
    }
  }

  isEmailRepeatValid() {
    const formControl = this.createNewUserForm.get('email');
    const formControlRepeat = this.createNewUserForm.get('emailRepeat');
    if (formControl.touched) {
      return formControl.valid && formControlRepeat.value === formControl.value;
    } else {
      return true;
    }
  }

  isPasswordValid() {
    const formControl = this.createNewUserForm.get('password');
    if (formControl.touched) {
      return formControl.valid;
    } else {
      return true;
    }
  }

  isPasswordRepeatValid() {
    const formControl = this.createNewUserForm.get('password');
    const formControlRepeat = this.createNewUserForm.get('passwordRepeat');
    if (formControl.touched) {
      return formControl.valid && formControlRepeat.value === formControl.value;
    } else {
      return true;
    }
  }

  createFormGroup() {
    return new FormGroup({
      nick: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      emailRepeat: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      passwordRepeat: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }
}
