import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { PersonalDetails } from '../models/personal-details.model';
import { Language } from '../models/language.model';
import { WorkExperience } from '../models/work-experience.model';
import { Workshop } from '../models/workshop.model';
import { Education } from '../models/education.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private apiUrl = `${environment.apiUrl}/resumes`;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  // Create a new resume
  createResume(resumeData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .post(this.apiUrl, resumeData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get all resumes
  getResumes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .get(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get a specific resume by ID
  getResumeById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .get(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update a resume
  updateResume(id: string, resumeData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .put(`${this.apiUrl}/${id}`, resumeData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a resume
  deleteResume(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError = (error: any) => {
    console.error('API Error:', error);
    if (error.error) {
      console.error('Error details:', error.error);
    }
    if (error.status) {
      console.error('Status:', error.status);
    }
    return throwError(() => error);
  };
}
