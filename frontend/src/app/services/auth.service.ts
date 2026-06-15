import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // For Registration Component (Handles Text/String response)
  register(registerData: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, registerData, {
      responseType: 'text'
    });
  }

  // For Login Component (Handles JSON Map object response)
  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, loginData).pipe(
      tap(response => {
        // Backend se status SUCCESS aane par tokens aur profile data store karein
        if (response && response.status === 'SUCCESS') {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
          if (response.userId) {
            localStorage.setItem('loggedInUserId', response.userId.toString());
          }
          if (response.userName) {
            localStorage.setItem('loggedInUserName', response.userName);
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('loggedInUserName');
    localStorage.removeItem('userEmail');
  }

  isLoggedIn(): boolean {
    // Agar custom local cache control state manage ho rahi ho
    return !!localStorage.getItem('loggedInUserId');
  }
}
