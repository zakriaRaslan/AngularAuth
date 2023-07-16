import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import validForm from 'src/app/Helpers/validForm';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  userIcon = faUser;
  lockIcon = faLock;
  passwordType: string = 'password';
  eyeIcon = faEyeSlash;
  isText: boolean = false;
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

signUp(){
  if(this.signupForm.valid){
    console.log(this.signupForm.value);
  }else{
    validForm.validAllFormFields(this.signupForm);
  }
}

  togglePassword() {
    this.isText = !this.isText;
    if (this.isText) {
      this.passwordType = 'text';
      this.eyeIcon = faEye;
    } else {
      this.passwordType = 'password';
      this.eyeIcon = faEyeSlash;
    }
  }
}
