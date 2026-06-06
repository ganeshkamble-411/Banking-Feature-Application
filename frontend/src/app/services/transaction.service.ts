import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl =
    'http://localhost:8080/api/transaction';

  constructor(private http: HttpClient) {}

  transfer(data: any) {
    return this.http.post(
      `${this.baseUrl}/transfer`,
      data,
      { responseType: 'text' }
    );
  }

  history(accountId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/history/${accountId}`
    );
  }

  deposit(data: any) {
    return this.http.post(
      `${this.baseUrl}/deposit`,
      data,
      { responseType: 'text' }
    );
  }

  withdraw(data: any) {
    return this.http.post(
      `${this.baseUrl}/withdraw`,
      data,
      { responseType: 'text' }
    );
  }
}

