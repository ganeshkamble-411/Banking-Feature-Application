import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = 'http://localhost:8080/api/account';

  constructor(private http: HttpClient) {}

  getAccountByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  createAccount(data: any) {
    return this.http.post(
      `${this.baseUrl}/create`,
      data
    );
  }

  getAccount(id: number) {
    return this.http.get(
      `${this.baseUrl}/${id}`
    );
  }

  getBalance(id: number) {
    return this.http.get<number>(
      `${this.baseUrl}/balance/${id}`
    );
  }
}

