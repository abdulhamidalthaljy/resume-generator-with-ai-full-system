import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    // Check for token in URL parameters first (from OAuth redirect)
    this.handleTokenFromUrl();
    this.checkAuthStatus().subscribe();
  }

  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';

  private handleTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);

      // Clean up URL by removing token parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  checkAuthStatus() {
    const headers = this.getAuthHeaders();

    return this.http
      .get<{ isAuthenticated: boolean; user: User | null }>(
        `${this.apiUrl}/auth/status`,
        { headers }
      )
      .pipe(
        tap((response) => {
          this.isAuthenticatedSubject.next(response.isAuthenticated);
          if (response.isAuthenticated && response.user) {
            this.currentUserSubject.next(response.user);
          } else {
            this.currentUserSubject.next(null);
            // Clear invalid token
            localStorage.removeItem(this.TOKEN_KEY);
          }
        }),
        catchError((error) => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          localStorage.removeItem(this.TOKEN_KEY);
          return of({ isAuthenticated: false, user: null });
        })
      );
  }

  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  logout() {
    // Clear token from localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);

    return this.http.get(`${this.apiUrl}/auth/logout`).pipe(
      catchError((error) => {
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
