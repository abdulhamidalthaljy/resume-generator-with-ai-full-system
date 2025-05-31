import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Welcome to Resume Builder</h2>
      <p>Please sign in to continue</p>
      <button (click)="loginWithGoogle()" class="google-btn">
        <img src="assets/google-icon.svg" alt="Google Icon" />
        Sign in with Google
      </button>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #f5f5f5;
      }
      h2 {
        margin-bottom: 1rem;
        color: #333;
      }
      p {
        margin-bottom: 2rem;
        color: #666;
      }
      .google-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .google-btn:hover {
        background-color: #f8f8f8;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .google-btn img {
        width: 20px;
        height: 20px;
      }
    `,
  ],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {
    // Redirect to dashboard if already authenticated
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
