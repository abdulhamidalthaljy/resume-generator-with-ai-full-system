import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';
import { AuthService } from './services/auth.service';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <app-notification-toast></app-notification-toast>
  `,
  styles: [],
  imports: [RouterOutlet, NotificationToastComponent],
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'resume-builder';
  private subscription = new Subscription();

  constructor(
    private socketService: SocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Connect to socket when user is authenticated
    this.subscription.add(
      this.authService.isAuthenticated$.subscribe((isAuth) => {
        if (isAuth) {
          // Get user info and connect to socket
          const user = this.authService.currentUser;
          if (user) {
            this.socketService.connect({
              name: user.name || 'Anonymous',
              email: user.email || '',
            });
          }
        } else {
          this.socketService.disconnect();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.socketService.disconnect();
  }
}
