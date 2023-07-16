import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import validForm from 'src/app/Helpers/validForm';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { NgToastService } from 'ng-angular-popup'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userIcon = faUser;
  lockIcon = faLock;
  passwordType: string = 'password';
  eyeIcon = faEyeSlash;
  isText: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthApiService,
    private router: Router,
    private toast:NgToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res => {
          this.toast.success({detail:"Success",summary:res.message,duration:5000})
          this.loginForm.reset();
          this.router.navigate(['dashboard']);
        }),
        error:(err=>{
          this.toast.error({detail:"Error",summary:err.message,duration:5000})
        })
      });
    } else {
      //Send Validation
      validForm.validAllFormFields(this.loginForm);
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
