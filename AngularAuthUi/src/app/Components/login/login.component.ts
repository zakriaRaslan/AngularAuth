import { Component, OnInit, Input } from '@angular/core';
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
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/Services/user-store.service';
import { ResetPasswordService } from 'src/app/Services/reset-password.service';
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
  public resetPasswordEmail!: string;
  public isEmailValid!: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthApiService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private passwordService: ResetPasswordService
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
        next: (res) => {
          console.log(res);
          this.toast.success({
            detail: 'Success',
            summary: res.message,
            duration: 5000,
          });
          this.loginForm.reset();
          this.authService.addToken(res.accessToken);
          this.authService.addRefreshToken(res.refreshToken);
          const userPayload = this.authService.decodedToken();
          this.userStore.setFullNameForStore(userPayload.unique_name);
          this.userStore.setRoleForStore(userPayload.role);
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          console.log(err);
          this.toast.error({
            detail: 'Error',
            summary: err.error.message,
            duration: 5000,
          });
        },
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

  CheckValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isEmailValid = pattern.test(value);
    return this.isEmailValid;
  }

  ConfirmEmail() {
    this.toast.info({detail:'Info',summary:'Please Wait some Seconds..',duration:3000});
    if (this.CheckValidEmail(this.resetPasswordEmail)) {
      this.passwordService
        .SendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            this.resetPasswordEmail = '';
            let btn = document.getElementById('closeBtn');
            btn?.click();
            this.toast.success({
              detail: 'Success',
              summary: 'Reset Link Send To Your Email Successfully',
              duration: 3000,
            });
          },
          error: (err) => {
            console.log(err);
            this.toast.error({
              detail: 'Error',
              summary: 'Some Thing Went Wrong',
              duration: 3000,
            });
          },
        });
    }
  }
}
