import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Generate PDF for a saved resume by ID
   */
  generateResumePDF(resumeId: string, templateId?: string): Observable<Blob> {
    const url = `${this.apiUrl}/api/pdf/generate/${resumeId}`;
    let params = new HttpParams();
    if (templateId) {
      params = params.set('template', templateId);
    }

    return this.http.post(
      url,
      {},
      {
        params,
        responseType: 'blob',
        headers: new HttpHeaders({
          Accept: 'application/pdf',
        }),
      }
    );
  }

  /**
   * Generate PDF directly from resume data (without saving to database)
   */
  generatePDFFromData(
    resumeData: any,
    templateId: string = 'classic'
  ): Observable<Blob> {
    const url = `${this.apiUrl}/api/pdf/generate-direct`;

    return this.http.post(
      url,
      {
        resumeData,
        templateId,
      },
      {
        responseType: 'blob',
        headers: new HttpHeaders({
          Accept: 'application/pdf',
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  /**
   * Generate preview image for a resume
   */
  generateResumePreview(
    resumeId: string,
    templateId?: string
  ): Observable<Blob> {
    const url = `${this.apiUrl}/api/pdf/preview/${resumeId}`;
    let params = new HttpParams();
    if (templateId) {
      params = params.set('template', templateId);
    }

    return this.http.post(
      url,
      {},
      {
        params,
        responseType: 'blob',
        headers: new HttpHeaders({
          Accept: 'image/jpeg',
        }),
      }
    );
  }

  /**
   * Check if PDF service is healthy
   */
  checkPDFServiceHealth(): Observable<any> {
    const url = `${this.apiUrl}/api/pdf/health`;
    return this.http.get(url);
  }

  /**
   * Download blob as file
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Generate and download PDF for a resume
   */
  async downloadResumePDF(
    resumeId: string,
    resumeName: string = 'Resume',
    templateId?: string
  ): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.generateResumePDF(resumeId, templateId)
      );
      if (blob) {
        const filename = `${resumeName}_${new Date().getTime()}.pdf`;
        this.downloadBlob(blob, filename);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }

  /**
   * Generate and download PDF from resume data
   */
  async downloadPDFFromData(
    resumeData: any,
    templateId: string = 'classic'
  ): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.generatePDFFromData(resumeData, templateId)
      );
      if (blob) {
        const resumeName = resumeData.personalDetails?.name || 'Resume';
        const filename = `${resumeName}_${new Date().getTime()}.pdf`;
        this.downloadBlob(blob, filename);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
}
