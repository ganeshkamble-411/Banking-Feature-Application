import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'http://localhost:8080/api/accounts';

  constructor(private http: HttpClient) {}

  // Request token header intercept assembly utility
  private createAuthorizationHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Resolving database account primary identifiers dynamically by userId context
  getAccountByUserId(userId: number): Observable<any> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`, { headers });
  }

  // Wizard patch endpoint node tracking update state data logic 
  updateProfileSecurityLimits(userId: number, updatePayload: any): Observable<any> {
    const headers = this.createAuthorizationHeaders();
    return this.http.put<any>(`${this.baseUrl}/user/${userId}/security-profile`, updatePayload, { headers });
  }
}