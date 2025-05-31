import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }

  private apiUrl = environment.apiUrl;

  checkAuthStatus() {
    return this.http
      .get<{ isAuthenticated: boolean; user: User | null }>(
        `${this.apiUrl}/auth/status`,
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          console.log('Auth status response:', response);
          this.isAuthenticatedSubject.next(response.isAuthenticated);
          if (response.isAuthenticated && response.user) {
            this.currentUserSubject.next(response.user);
          } else {
            this.currentUserSubject.next(null);
          }
        }),
        catchError((error) => {
          console.error('Auth status check failed:', error);
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          return of({ isAuthenticated: false, user: null });
        })
      );
  }

  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  logout() {
    return this.http
      .get(`${this.apiUrl}/auth/logout`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        }),
        catchError((error) => {
          console.error('Logout failed:', error);
          return of(null);
        })
      );
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
