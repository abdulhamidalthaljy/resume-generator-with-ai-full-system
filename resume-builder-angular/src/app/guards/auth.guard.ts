import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const authStatus = await firstValueFrom(
        this.authService.checkAuthStatus()
      );

      if (authStatus.isAuthenticated) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
    } catch (error) {
      console.error('Auth guard error:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
