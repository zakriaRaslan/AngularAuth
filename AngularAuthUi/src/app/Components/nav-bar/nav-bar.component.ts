import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  fullName:string=''
constructor(private auth:AuthApiService, private userStore:UserStoreService ,private router:Router,private authService:AuthApiService){}

ngOnInit(): void {
this.userStore.getFullNameFromStore().subscribe((val=>{
 const fullNameFromToken = this.auth.getFullNameFormToken();
  this.fullName=val || fullNameFromToken;
}))
}

logout(){
  this.router.navigate(["login"]);
  this.authService.LogOut();
}

}
