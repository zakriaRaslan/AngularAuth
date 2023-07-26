import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmedValidator } from 'src/app/Helpers/confirm-password.validator';
import validForm from 'src/app/Helpers/validForm';

import { ResetPassword } from 'src/app/Models/reset-password.model';
import { ResetPasswordService } from 'src/app/Services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj: ResetPassword = new ResetPassword();
  isText: boolean = false;
  passwordType: string = 'password';
  eyeIcon = faEyeSlash;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private resetService: ResetPasswordService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: new FormControl(null, [Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required]),
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );

    this.activateRoute.queryParams.subscribe((val) => {
      this.emailToReset = val['email'];
      let urlToken = val['code'];
      this.emailToken = urlToken.replace(/ /g, '+');
    });
  }

  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.NewPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.ConfirmPassword =
        this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.Email = this.emailToReset;
      this.resetPasswordObj.EmailToken = this.emailToken;

      this.resetService.ResetPassword(this.resetPasswordObj).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Password Reset Successfully',
            duration: 3000,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'Error',
            summary: 'Some thing went wrong',
            duration: 3000,
          });
        },
      });
    } else {
      validForm.validAllFormFields(this.resetPasswordForm);
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
