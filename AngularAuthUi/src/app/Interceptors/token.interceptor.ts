import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, map, mergeMap, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../Services/auth-api.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../Models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthApiService,
    private toast: NgToastService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    var myToken = this.auth.getToken();
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }, //"Bearer"+" "+ myToken
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // this.router.navigate(['login']);
            // this.toast.warning({
            //   detail: 'Warring',
            //   summary: 'Your Token Is Expired,Please Login Again',
            // });
           return this.handleUnAuthorizedError(request,next);

          }
        }
        return throwError(() => err);
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel)
    .pipe(
      switchMap((data:TokenApiModel) => {
        this.auth.addToken(data.accessToken);
        this.auth.addRefreshToken(data.refreshToken);
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${data.accessToken}` },
        })
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.router.navigate(['login']);
          this.toast.warning({
            detail: 'Warring',
            summary: 'Your Token Is Expired,Please Login Again',
          });
        });
      })
    );

  }
}

