import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// export const interceptortokenInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

export const interceptortokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
// const cookieService = inject(CookieService);
// const token = cookieService.get('your-token');
const token = localStorage.getItem('token');
if (token) {
  const cloned = req.clone({
    setHeaders: {
      Authorization: 'Bearer '+ token,
    },
  });
  return next(cloned);
}

else {
  return next(req);
}

// return next(req)
};
