import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from '../Models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
baseUrl:string='https://localhost:7174/api/Users/';
  constructor(private http:HttpClient) { }

  SendResetPasswordLink(email:string){
    return this.http.post<any>(`${this.baseUrl}send-reset-email/${email}`,{});
  }
  ResetPassword(resetPassword:ResetPassword){
    return this.http.post<any>(`${this.baseUrl}reset-password`,resetPassword);
  }
}
