import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {faUser,faLock,faEyeSlash ,faEye} from "@fortawesome/free-solid-svg-icons"
import validForm from 'src/app/Helpers/validForm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userIcon=faUser;
  lockIcon=faLock;
  passwordType:string="password";
  eyeIcon = faEyeSlash;
  isText:boolean=false;
  loginForm!:FormGroup

  constructor(private fb:FormBuilder){}

ngOnInit(): void {
 this.loginForm=this.fb.group({
  userName:['',Validators.required],
  password:['',Validators.required]
}
 )

}

loginSubmit(){
  if(this.loginForm.valid){
    //Send Data To BackEnd
  console.log(this.loginForm.value)
}else{
  //Send Validation
  validForm.validAllFormFields(this.loginForm);
}
}


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
