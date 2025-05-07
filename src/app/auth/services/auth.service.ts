import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  checkUserExists(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}users/${email}`).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  createUser(email: string): Observable<any> {
    return this.http.post(this.apiUrl + 'users', { email }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
