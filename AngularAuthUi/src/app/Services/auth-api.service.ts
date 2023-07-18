import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  basePathUrl:string='https://localhost:7174/api/Users';
 private userPayload:any
  constructor(private http:HttpClient ) {
    this.userPayload=this.decodedToken();
  }

  login(model:any){
   return this.http.post<any>(`${this.basePathUrl}/login`,model)
  }

  signUp(model:any){
   return this.http.post<any>(`${this.basePathUrl}/register`,model);
  }

  addToken(tokenValue:string):void{
    localStorage.setItem("token",tokenValue);
  }

  getToken(){
  return localStorage.getItem("token");
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem("token");
  }

  LogOut(){
    localStorage.removeItem("token")
  }

decodedToken(){
  const JwtHelper = new JwtHelperService();
  const token = this.getToken()!;
  return JwtHelper.decodeToken(token)
}

getFullNameFormToken(){
if(this.userPayload){
  return this.userPayload.unique_name;
}
}
getRoleFromToken(){
  if(this.userPayload){
    return this.userPayload.role;
  }
}

}
