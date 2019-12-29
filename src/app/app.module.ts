import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { HttpInterceptorService } from "./global-services/http-interceptor/http-interceptor.service";

import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { TopicPageComponent } from "./topic-page/topic-page.component";
import { PostPageComponent } from "./post-page/post-page.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";
import { HeaderBarComponent } from "./header-bar/header-bar.component";
import { AuthGuard } from "./global-services/guard-service/auth-guard.service";
import { LoginService } from "./global-services/login-service/login-service.service";
import { TopicFormComponent } from './topic-page/topic-form/topic-form.component';
import { TopicListComponent } from './topic-page/topic-list/topic-list.component';

const appRoutes: Routes = [
  {
    path: "",
    component: LoginPageComponent
  },
  {
    path: "login",
    component: LoginPageComponent
  },
  {
    path: "topics",
    component: TopicPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "posts",
    component: PostPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    component: NotFoundPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    TopicPageComponent,
    PostPageComponent,
    NotFoundPageComponent,
    HeaderBarComponent,
    TopicFormComponent,
    TopicListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthGuard,
    CookieService,
    LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
