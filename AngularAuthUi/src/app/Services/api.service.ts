import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService  {
baseUrl:string="https://localhost:7174/api/Users"
  constructor(private http:HttpClient) { }

  getUsers(){
  return this.http.get<any>(this.baseUrl);
  }
}
