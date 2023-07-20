import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../Models/token-api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  baseUrl: string = 'https://localhost:7174/api/Users';
  private userPayload: any;
  constructor(private http: HttpClient) {
    this.userPayload = this.decodedToken();
  }

  login(model: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, model);
  }

  signUp(model: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, model);
  }

  addToken(tokenValue: string): void {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  addRefreshToken(refreshToken:string){
    localStorage.setItem("refreshToken",refreshToken);
  }
  getRefreshToken(){
    return localStorage.getItem("refreshToken");
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  LogOut() {
    localStorage.removeItem('token');
  }

  decodedToken() {
    const JwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return JwtHelper.decodeToken(token);
  }

  getFullNameFormToken() {
    if (this.userPayload) {
      return this.userPayload.unique_name;
    }
  }

  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }

  renewToken(tokenApiModel:TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}/refresh`,tokenApiModel)
  }
}
