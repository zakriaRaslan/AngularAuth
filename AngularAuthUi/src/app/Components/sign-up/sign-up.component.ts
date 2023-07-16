import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import validForm from 'src/app/Helpers/validForm';
import { AuthApiService } from 'src/app/Services/auth-api.service';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthApiService,
    private router: Router,
    private toast:NgToastService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signUp() {
    if (this.signupForm.valid) {
      this.authService.signUp(this.signupForm.value)
      .subscribe({
        next:(res => {
        this.toast.success({detail:"Success",summary:res.message,duration:5000})
          this.signupForm.reset();
          this.router.navigate(['login']);
        })
        ,error: (err => {
          this.toast.error({detail:"Error",summary:err.message,duration:5000})
        })
      })
      console.log(this.signupForm.value)
    } else {
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
