import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/transaction';

  constructor(private http: HttpClient) {}

  // Secure Angular Interceptor Authorization Headers
  private createAuthorizationHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // FIXED: Added deposit method back with safe execution handling
  deposit(data: any): Observable<string> {
    const headers = this.createAuthorizationHeaders();
    return this.http.post(`${this.baseUrl}/deposit`, data, { 
      headers, 
      responseType: 'text' 
    });
  }

  // FIXED: Added withdraw method back 
  withdraw(data: any): Observable<string> {
    const headers = this.createAuthorizationHeaders();
    return this.http.post(`${this.baseUrl}/withdraw`, data, { 
      headers, 
      responseType: 'text' 
    });
  }

  // Fund transfer node routing orchestrator
  transfer(data: any): Observable<string> {
    const headers = this.createAuthorizationHeaders();
    return this.http.post(`${this.baseUrl}/transfer`, data, { 
      headers, 
      responseType: 'text' 
    });
  }

  // Pull database ledger arrays dynamically mapping to account identifier
  history(accountId: number): Observable<any[]> {
    const headers = this.createAuthorizationHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/history/${accountId}`, { headers });
  }
}


