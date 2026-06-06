import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/register`,
      data,
      {
        responseType: 'text'
      }
    );
  }

  login(data: any): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/login`,
      data,
      {
        responseType: 'text'
      }
    );
  }
}