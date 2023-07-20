import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users:any[]=[];
  role:string='User';

constructor(private authService:AuthApiService , private router:Router,private Api:ApiService ,private userStore:UserStoreService,){

}

// logout(){
//   this.router.navigate(["login"]);
//   this.authService.LogOut();
// }
ngOnInit(): void {
    // this.Api.getUsers().subscribe((res)=>{
    //   this.users=res;
    // });

    this.userStore.getRoleFromStore().subscribe((val)=>{
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken
    })

}
}
