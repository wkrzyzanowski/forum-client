import { Component } from '@angular/core';
import { LoginService } from './global-services/http-services/login-service/login-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'forum-client';

  constructor(private loginService: LoginService) {}
}
