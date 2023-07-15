import { Component } from '@angular/core';
import {faUser,faLock,faEyeSlash ,faEye} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userIcon=faUser;
  lockIcon=faLock;
  passwordType:string="password";
  eyeIcon = faEyeSlash;
  isText:boolean=false;

  constructor(){}

  togglePassword(){
    this.isText=!this.isText
    if(this.isText){
      this.passwordType="text";
      this.eyeIcon=faEye;
    }else{
      this.passwordType="password";
      this.eyeIcon=faEyeSlash;
    }
  }
}
