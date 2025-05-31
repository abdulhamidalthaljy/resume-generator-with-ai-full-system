import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ResumeService } from '../../services/resume.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    <div class="dashboard-container">
      <header class="header">
        <div class="user-info">
          <h1>Welcome, {{ (authService.currentUser$ | async)?.name }}!</h1>
          <p class="subtitle">Manage your professional resumes</p>
        </div>
        <button (click)="logout()" class="logout-btn">
          <span>Logout</span>
        </button>
      </header>

      <main class="main-content">
        <div class="dashboard-content">
          <div class="content-header">
            <h2>Your Resumes</h2>
            <button (click)="createNewResume()" class="btn btn-primary">
              <span>+ Create New Resume</span>
            </button>
          </div>

          <div class="resumes-grid" *ngIf="resumes.length > 0; else noResumes">
            <div
              *ngFor="let resume of resumes; let i = index"
              class="resume-card"
            >
              <div class="resume-header">
                <h3>{{ getResumeTitle(resume) }}</h3>
                <div class="resume-meta">
                  <span class="date"
                    >Created: {{ formatDate(resume.createdAt) }}</span
                  >
                  <span
                    class="date"
                    *ngIf="
                      resume.updatedAt && resume.updatedAt !== resume.createdAt
                    "
                  >
                    Updated: {{ formatDate(resume.updatedAt) }}
                  </span>
                </div>
              </div>
              <div class="resume-preview">
                <p class="summary" *ngIf="resume.informationSummary">
                  {{ resume.informationSummary | slice : 0 : 150
                  }}{{ resume.informationSummary.length > 150 ? '...' : '' }}
                </p>
                <p
                  class="summary"
                  *ngIf="
                    !resume.informationSummary && resume.personalDetails?.name
                  "
                >
                  Resume for {{ resume.personalDetails.name }}
                </p>
                <div class="tags" *ngIf="resume.languages?.length">
                  <span
                    class="tag"
                    *ngFor="let lang of resume.languages.slice(0, 3)"
                  >
                    {{ lang.name }}
                  </span>
                  <span class="tag more" *ngIf="resume.languages.length > 3">
                    +{{ resume.languages.length - 3 }} more
                  </span>
                </div>
              </div>

              <div class="resume-actions">
                <button
                  (click)="editResume(getResumeId(resume))"
                  class="btn btn-secondary"
                  title="Edit Resume"
                >
                  ✏️ Edit
                </button>
                <button
                  (click)="previewResume(resume)"
                  class="btn btn-outline"
                  title="Preview Resume"
                >
                  👁️ Preview
                </button>
                <button
                  (click)="duplicateResume(resume)"
                  class="btn btn-outline"
                  title="Duplicate Resume"
                >
                  📄 Duplicate
                </button>
                <button
                  (click)="deleteResume(getResumeId(resume), i)"
                  class="btn btn-danger"
                  title="Delete Resume"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>

          <ng-template #noResumes>
            <div class="empty-state">
              <div class="empty-icon">📄</div>
              <h3>No resumes yet</h3>
              <p>Create your first professional resume to get started</p>
              <button (click)="createNewResume()" class="btn btn-primary">
                Create Your First Resume
              </button>
            </div>
          </ng-template>

          <!-- Loading state -->
          <div class="loading" *ngIf="isLoading">
            <div class="spinner"></div>
            <p>Loading your resumes...</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 0;
      }

      .header {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .user-info h1 {
        margin: 0;
        color: white;
        font-size: 2rem;
        font-weight: 600;
      }

      .subtitle {
        margin: 0.5rem 0 0 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
      }

      .logout-btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .logout-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      .main-content {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .content-header h2 {
        color: white;
        font-size: 1.8rem;
        margin: 0;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .btn-primary {
        background: #4f46e5;
        color: white;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      }

      .btn-primary:hover {
        background: #4338ca;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
      }

      .btn-secondary {
        background: #10b981;
        color: white;
        font-size: 0.8rem;
        padding: 0.5rem 1rem;
      }

      .btn-secondary:hover {
        background: #059669;
      }

      .btn-outline {
        background: transparent;
        color: #6b7280;
        border: 1px solid #d1d5db;
        font-size: 0.8rem;
        padding: 0.5rem 1rem;
      }

      .btn-outline:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
      }

      .btn-danger {
        background: #ef4444;
        color: white;
        font-size: 0.8rem;
        padding: 0.5rem 1rem;
      }

      .btn-danger:hover {
        background: #dc2626;
      }

      .resumes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .resume-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .resume-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .resume-header h3 {
        margin: 0 0 0.5rem 0;
        color: #1f2937;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .resume-meta {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-bottom: 1rem;
      }

      .date {
        color: #6b7280;
        font-size: 0.8rem;
      }

      .resume-preview {
        margin-bottom: 1.5rem;
      }

      .summary {
        color: #4b5563;
        font-size: 0.9rem;
        line-height: 1.5;
        margin-bottom: 1rem;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .tag {
        background: #e5e7eb;
        color: #374151;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .tag.more {
        background: #ddd6fe;
        color: #6d28d9;
      }

      .resume-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(10px);
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        color: white;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
      }

      .empty-state p {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 2rem;
        font-size: 1rem;
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: white;
      }

      .spinner {
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top: 3px solid white;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 768px) {
        .resumes-grid {
          grid-template-columns: 1fr;
        }

        .content-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .resume-actions {
          justify-content: center;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  resumes: any[] = [];
  isLoading = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private resumeService: ResumeService
  ) {}

  ngOnInit() {
    this.loadResumes();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
  editResume(resumeId: string) {
    // Navigate to resume editor with the selected resume
    if (!resumeId || resumeId === 'new') {
      this.router.navigate(['/resume/new']);
    } else {
      this.router.navigate(['/resume', resumeId]);
    }
  }
  loadResumes() {
    this.isLoading = true;
    this.resumeService.getResumes().subscribe({
      next: (data: any) => {
        console.log('Loaded resumes:', data);
        console.log('First resume structure:', data[0]);
        console.log('Data type:', typeof data[0]);

        // Check if we received IDs instead of objects
        if (data && data.length > 0 && typeof data[0] === 'string') {
          console.warn(
            'Received resume IDs instead of objects. Converting to placeholder objects.'
          );
          // Convert ID strings to placeholder resume objects
          this.resumes = data.map((resumeId: string, index: number) => ({
            _id: resumeId,
            title: `Resume ${index + 1}`,
            personalDetails: {
              name: `Resume ${index + 1}`,
            },
            informationSummary: 'Resume data needs to be loaded',
            languages: [],
            workExperience: [],
            workshops: [],
            education: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
        } else {
          // Normal processing for resume objects
          this.resumes = (data || []).map((resume: any, index: number) => {
            // Ensure resume has an ID
            if (!resume._id && !resume.id) {
              console.warn(`Resume at index ${index} missing ID:`, resume);
              resume._id = `temp_${Date.now()}_${index}`;
            }
            return resume;
          });
        }

        console.log('Processed resumes:', this.resumes);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading resumes:', error);
        this.isLoading = false;
        if (error.status === 401) {
          console.log('User not authenticated, redirecting to login');
          this.router.navigate(['/login']);
        }
      },
    });
  }

  createNewResume() {
    this.router.navigate(['/resume/new']);
  }
  previewResume(resume: any) {
    // Navigate to the dedicated preview page
    const resumeId = this.getResumeId(resume);
    if (resumeId) {
      this.router.navigate(['/resume', resumeId, 'preview']);
    } else {
      alert('Cannot preview resume: Invalid resume ID');
    }
  }
  duplicateResume(resume: any) {
    if (confirm('Create a copy of this resume?')) {
      // Create a copy without the _id so it creates a new resume
      const resumeCopy = {
        ...resume,
        title: (resume.title || 'Untitled Resume') + ' (Copy)',
        personalDetails: {
          ...resume.personalDetails,
          name: resume.personalDetails?.name
            ? resume.personalDetails.name + ' (Copy)'
            : 'Untitled (Copy)',
        },
      };
      delete resumeCopy._id;
      delete resumeCopy.id;
      delete resumeCopy.createdAt;
      delete resumeCopy.updatedAt;

      this.resumeService.createResume(resumeCopy).subscribe({
        next: (newResume) => {
          console.log('Resume duplicated:', newResume);
          this.loadResumes(); // Reload to show the new resume
        },
        error: (error) => {
          console.error('Error duplicating resume:', error);
          alert('Error creating copy. Please try again.');
        },
      });
    }
  }
  deleteResume(resumeId: string, index: number) {
    if (!resumeId) {
      alert('Cannot delete resume: Invalid resume ID');
      return;
    }

    const resumeName = this.getResumeTitle(this.resumes[index]);
    if (
      confirm(
        `Are you sure you want to delete "${resumeName}"? This action cannot be undone.`
      )
    ) {
      this.resumeService.deleteResume(resumeId).subscribe({
        next: () => {
          console.log('Resume deleted successfully');
          this.resumes.splice(index, 1); // Remove from local array
        },
        error: (error) => {
          console.error('Error deleting resume:', error);
          alert('Error deleting resume. Please try again.');
        },
      });
    }
  }
  getResumeId(resume: any): string {
    return resume._id || resume.id || '';
  }

  getResumeTitle(resume: any): string {
    if (resume.title) {
      return resume.title;
    }
    if (resume.personalDetails?.name) {
      return `${resume.personalDetails.name}'s Resume`;
    }
    return 'Untitled Resume';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Method to fix corrupted resume data
  fixCorruptedData() {
    console.log('Attempting to fix corrupted resume data...'); // Call the migration endpoint
    fetch('http://localhost:5050/api/resumes/fix-data', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Migration result:', data);
        alert('Data migration completed. Please refresh the page.');
        // Reload resumes after migration
        this.loadResumes();
      })
      .catch((error) => {
        console.error('Migration failed:', error);
        alert('Failed to migrate data. Please contact support.');
      });
  }
}
