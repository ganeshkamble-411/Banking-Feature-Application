import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// 🔷 Frontend interface user profile structure ko handle karne ke liye
export interface UserProfile {
  userId: number;
  fullName: string;
  email: string;
  accountId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  // 🔷 Centralized reactive state variable jo saare components me update broadcast karega
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Application start hote hi stored profile data ko automatic restore karo
    this.restoreSession();
  }

  // Synchronously data check karne ke liye helper method (agar kisi function me seedhe chahiye ho)
  public get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  register(registerData: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, registerData, { responseType: 'text' });
  }

  // 🔷 Modified Login: Backend response data ko observe aur process karne ke liye JSON request pipeline
  login(loginData: any): Observable<any> {
    // Note: Isse { responseType: 'text' } hata diya hai kyunki humara naya login endpoint ab pura complete response object/map bhej raha hai JSON format me.
    return this.http.post<any>(`${this.baseUrl}/login`, loginData).pipe(
      tap((response: any) => {
        if (response.status === 'SUCCESS' && response.user) {
          // LocalStorage me standard session data store kar rahe hain backward compatibility ke liye
          localStorage.setItem('userId', String(response.user.userId));
          localStorage.setItem('accountId', response.user.accountId);
          localStorage.setItem('userEmail', response.user.email);
          
          // Complete user context payload ko serialize karke stringify state me store kar rahe hain
          localStorage.setItem('user_profile', JSON.stringify(response.user));
          
          // Next emitter block ko stream me push kiya taaki Header automatic update ho jaye
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // 🔷 Page refresh hone par state ko restore karne ke liye fail-safe function
  private restoreSession(): void {
    const savedUser = localStorage.getItem('user_profile');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        console.error("Could not parse user profile from localStorage", e);
        this.logout();
      }
    }
  }

  // 🔷 Centralized clear state logout handler
  logout(): void {
    localStorage.clear();
    // Observable context ko explicitly null notify karwao
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue || !!localStorage.getItem('userEmail');
  }

  // 🔑 Direct Password Reset Pipeline
  forgotPasswordReset(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password-reset`, payload);
  }
}

