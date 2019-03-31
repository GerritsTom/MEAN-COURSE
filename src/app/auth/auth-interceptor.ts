import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

   intercept(req: HttpRequest<any>, next: HttpHandler) {
    // add token to req header
    const authToken = this.authService.getToken();

    // first clone the req
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    // and send it out
    return next.handle(authReq);
  }

}
