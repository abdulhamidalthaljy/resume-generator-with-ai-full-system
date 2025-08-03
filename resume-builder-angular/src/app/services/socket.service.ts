import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SocketNotification {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export interface UserActivity {
  type: 'editing' | 'template_change' | 'disconnected';
  user: string;
  resumeId?: string;
  templateName?: string;
  oldTemplate?: string;
  newTemplate?: string;
  timestamp: Date;
}

export interface ResumeActivity {
  type: 'created' | 'updated' | 'deleted';
  user: string;
  resumeTitle: string;
  templateName?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private connected = false;

  // Observables for real-time events
  private notificationsSubject = new BehaviorSubject<SocketNotification | null>(
    null
  );
  private userActivitySubject = new BehaviorSubject<UserActivity | null>(null);
  private resumeActivitySubject = new BehaviorSubject<ResumeActivity | null>(
    null
  );
  private userCountSubject = new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  public userActivity$ = this.userActivitySubject.asObservable();
  public resumeActivity$ = this.resumeActivitySubject.asObservable();
  public userCount$ = this.userCountSubject.asObservable();

  constructor() {
    this.socket = io(environment.apiUrl.replace('/api', ''), {
      autoConnect: false,
      withCredentials: true,
    });

    this.setupEventListeners();
  }

  connect(userData?: { name: string; email: string }) {
    if (!this.connected) {
      this.socket.connect();

      if (userData) {
        this.socket.emit('user:join', userData);
      }

      this.connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  private setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
    });

    // Notification events
    this.socket.on('notification', (data: SocketNotification) => {
      this.notificationsSubject.next(data);
    });

    // User activity events
    this.socket.on('user:activity', (data: UserActivity) => {
      this.userActivitySubject.next(data);
    });

    // Resume activity events
    this.socket.on('resume:activity', (data: ResumeActivity) => {
      this.resumeActivitySubject.next(data);
    });

    // User count updates
    this.socket.on('users:count', (count: number) => {
      this.userCountSubject.next(count);
    });
  }

  // Emit events to server
  emitResumeEditing(resumeId: string, templateName: string) {
    this.socket.emit('resume:editing', { resumeId, templateName });
  }

  emitResumeCreated(resumeTitle: string, templateName: string) {
    this.socket.emit('resume:created', { resumeTitle, templateName });
  }

  emitResumeUpdated(resumeTitle: string, templateName: string) {
    this.socket.emit('resume:updated', { resumeTitle, templateName });
  }

  emitTemplateChanged(oldTemplate: string, newTemplate: string) {
    this.socket.emit('template:changed', { oldTemplate, newTemplate });
  }

  isConnected(): boolean {
    return this.connected && this.socket.connected;
  }
}
