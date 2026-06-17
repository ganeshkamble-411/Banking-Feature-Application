import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(registerData: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, registerData, { responseType: 'text' });
  }

  login(loginData: any): Observable<any> {
    // responseType: 'text' rakhenge kyunki raw response handle karna asan hai angular pipelines me
    return this.http.post(`${this.baseUrl}/login`, loginData, { responseType: 'text' });
  }

  logout(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userEmail');
  }
}