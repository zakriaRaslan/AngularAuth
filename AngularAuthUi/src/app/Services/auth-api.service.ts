import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  basePathUrl:string='https://localhost:7174/api/Users';

  constructor(private http:HttpClient) { }

  login(model:any){
   return this.http.post<any>(`${this.basePathUrl}/login`,model)
  }

  signUp(model:any){
   return this.http.post<any>(`${this.basePathUrl}/register`,model);
  }
}
