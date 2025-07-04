import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SocketService,
  UserActivity,
  ResumeActivity,
} from '../../services/socket.service';
import { Subscription } from 'rxjs';

interface ActivityItem {
  id: string;
  type: 'user' | 'resume';
  icon: string;
  message: string;
  timestamp: Date;
  color: string;
}

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Live Activity</h3>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm text-gray-600"
            >{{ connectedUsers }} users online</span
          >
        </div>
      </div>

      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div
          *ngFor="let activity of activities; trackBy: trackById"
          class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <!-- Activity Icon -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            [ngClass]="activity.color"
          >
            <svg
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                [attr.d]="activity.icon"
              ></path>
            </svg>
          </div>

          <!-- Activity Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-800">{{ activity.message }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatTime(activity.timestamp) }}
            </p>
          </div>
        </div>

        <div *ngIf="activities.length === 0" class="text-center py-8">
          <svg
            class="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5M9 5v-.5"
            ></path>
          </svg>
          <p class="text-gray-500 text-sm">No recent activity</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ActivityFeedComponent implements OnInit, OnDestroy {
  activities: ActivityItem[] = [];
  connectedUsers = 0;
  private subscription = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    // Listen for user activities
    this.subscription.add(
      this.socketService.userActivity$.subscribe((activity) => {
        if (activity) {
          this.addUserActivity(activity);
        }
      })
    );

    // Listen for resume activities
    this.subscription.add(
      this.socketService.resumeActivity$.subscribe((activity) => {
        if (activity) {
          this.addResumeActivity(activity);
        }
      })
    );

    // Listen for user count updates
    this.subscription.add(
      this.socketService.userCount$.subscribe((count) => {
        this.connectedUsers = count;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private addUserActivity(activity: UserActivity) {
    let message = '';
    let icon = '';
    let color = '';

    switch (activity.type) {
      case 'editing':
        message = `${activity.user} is editing a resume`;
        icon =
          'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z';
        color = 'bg-blue-500';
        break;
      case 'template_change':
        message = `${activity.user} changed template from ${activity.oldTemplate} to ${activity.newTemplate}`;
        icon =
          'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z';
        color = 'bg-purple-500';
        break;
      case 'disconnected':
        message = `${activity.user} left`;
        icon =
          'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1';
        color = 'bg-gray-500';
        break;
    }

    this.addActivity({
      id: Date.now().toString(),
      type: 'user',
      icon,
      message,
      timestamp: activity.timestamp,
      color,
    });
  }

  private addResumeActivity(activity: ResumeActivity) {
    let message = '';
    let icon = '';
    let color = '';

    switch (activity.type) {
      case 'created':
        message = `${activity.user} created "${activity.resumeTitle}"`;
        icon = 'M12 6v6m0 0v6m0-6h6m-6 0H6';
        color = 'bg-green-500';
        break;
      case 'updated':
        message = `${activity.user} updated "${activity.resumeTitle}"`;
        icon =
          'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
        color = 'bg-blue-500';
        break;
      case 'deleted':
        message = `${activity.user} deleted "${activity.resumeTitle}"`;
        icon =
          'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16';
        color = 'bg-red-500';
        break;
    }

    this.addActivity({
      id: Date.now().toString(),
      type: 'resume',
      icon,
      message,
      timestamp: activity.timestamp,
      color,
    });
  }

  private addActivity(activity: ActivityItem) {
    this.activities.unshift(activity);

    // Keep only last 20 activities
    if (this.activities.length > 20) {
      this.activities = this.activities.slice(0, 20);
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
      const hours = Math.floor(seconds / 3600);
      return `${hours}h ago`;
    }
  }

  trackById(index: number, activity: ActivityItem): string {
    return activity.id;
  }
}
