import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { NgToastModule } from 'ng-angular-popup'
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { SideNavbarComponent } from './Components/side-navbar/side-navbar.component';
import { HomeComponent } from './Components/home/home.component';
import { UsersListComponent } from './Components/users-list/users-list.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, SignUpComponent,  DashboardComponent, NavBarComponent, SideNavbarComponent, HomeComponent, UsersListComponent, ResetPasswordComponent, NotfoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    FormsModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
