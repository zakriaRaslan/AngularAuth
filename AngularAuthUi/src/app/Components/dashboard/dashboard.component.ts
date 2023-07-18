import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';
import { AuthApiService } from 'src/app/Services/auth-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users:any[]=[];
constructor(private authService:AuthApiService , private router:Router,private Api:ApiService){}

// logout(){
//   this.router.navigate(["login"]);
//   this.authService.LogOut();
// }
ngOnInit(): void {
    this.Api.getUsers().subscribe((res)=>{
      this.users=res;
    });
}
}
