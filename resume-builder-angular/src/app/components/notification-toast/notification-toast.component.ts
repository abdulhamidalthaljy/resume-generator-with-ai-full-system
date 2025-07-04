import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SocketService,
  SocketNotification,
} from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        *ngFor="let notification of notifications; trackBy: trackByTimestamp"
        class="notification-toast transform transition-all duration-300 ease-in-out"
        [ngClass]="getNotificationClasses(notification)"
        [@slideInOut]
      >
        <div class="flex items-center p-4 rounded-lg shadow-lg max-w-sm">
          <!-- Icon -->
          <div class="flex-shrink-0 mr-3">
            <svg
              *ngIf="notification.type === 'success'"
              class="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              ></path>
            </svg>

            <svg
              *ngIf="notification.type === 'info'"
              class="w-5 h-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>

            <svg
              *ngIf="notification.type === 'warning'"
              class="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>

            <svg
              *ngIf="notification.type === 'error'"
              class="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>

          <!-- Message -->
          <div class="flex-1">
            <p class="text-sm font-medium text-white">
              {{ notification.message }}
            </p>
            <p class="text-xs text-gray-300 mt-1">
              {{ formatTime(notification.timestamp) }}
            </p>
          </div>

          <!-- Close button -->
          <button
            (click)="removeNotification(notification)"
            class="flex-shrink-0 ml-3 text-gray-300 hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-toast {
        animation: slideInRight 0.3s ease-out;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class NotificationToastComponent implements OnInit, OnDestroy {
  notifications: SocketNotification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.subscription.add(
      this.socketService.notifications$.subscribe((notification) => {
        if (notification) {
          this.addNotification(notification);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addNotification(notification: SocketNotification) {
    this.notifications.unshift(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Keep only last 5 notifications
    if (this.notifications.length > 5) {
      this.notifications = this.notifications.slice(0, 5);
    }
  }

  removeNotification(notification: SocketNotification) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  getNotificationClasses(notification: SocketNotification): string {
    const baseClasses = '';

    switch (notification.type) {
      case 'success':
        return baseClasses + ' bg-green-600';
      case 'info':
        return baseClasses + ' bg-blue-600';
      case 'warning':
        return baseClasses + ' bg-yellow-600';
      case 'error':
        return baseClasses + ' bg-red-600';
      default:
        return baseClasses + ' bg-gray-600';
    }
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      return 'Just now';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ago`;
    } else {
      return new Date(timestamp).toLocaleTimeString();
    }
  }

  trackByTimestamp(index: number, notification: SocketNotification): number {
    return new Date(notification.timestamp).getTime();
  }
}
