//To intercept the JWT token that generated from the successful login to every secure HTTP request,
// we will use Angular 8 HttpInterceptor.

import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


//Create a class that implementing HttpInterceptor method.
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    //Inject the required module to the constructor inside the class.
    constructor(private router: Router) {}

    //Implement a custom Interceptor function.
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': token
        }
      });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
          this.router.navigate(['login']);
        }
        if (error.status === 400) {
          alert(error.error);
        }
        return throwError(error);
      }));
}
}