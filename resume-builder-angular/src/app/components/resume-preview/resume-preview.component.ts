import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeService } from '../../services/resume.service';
import { PdfService } from '../../services/pdf.service';
import {
  TemplateService,
  ResumeTemplate,
} from '../../services/template.service';

// Import all your models
import { PersonalDetails } from '../../models/personal-details.model';
import { Language } from '../../models/language.model';
import { WorkExperience } from '../../models/work-experience.model';
import { Workshop } from '../../models/workshop.model';
import { Education } from '../../models/education.model';

// Import template components
import { ClassicTemplateComponent } from '../templates/classic-template/classic-template.component';
import { ModernTemplateComponent } from '../templates/modern-template/modern-template.component';
import { MinimalTemplateComponent } from '../templates/minimal-template/minimal-template.component';
import { ExecutiveTemplateComponent } from '../templates/executive-template/executive-template.component';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [
    CommonModule,
    ClassicTemplateComponent,
    ModernTemplateComponent,
    MinimalTemplateComponent,
    ExecutiveTemplateComponent,
  ],
  templateUrl: './resume-preview.component.html',
  styleUrls: ['./resume-preview.component.css'],
})
export class ResumePreviewComponent implements OnInit, OnChanges {
  // Define Inputs for all data sections (for when used as a child component)
  @Input() personalDetails?: PersonalDetails;
  @Input() informationSummary?: string;
  @Input() languages?: Language[];
  @Input() workExperience?: WorkExperience[];
  @Input() workshops?: Workshop[];
  @Input() education?: Education[];

  // New inputs for the resume builder component
  @Input() resumeData?: any;
  @Input() selectedTemplate?: ResumeTemplate;

  // For standalone page usage
  resumeId?: string;
  resume: any = null;
  isLoading = true;
  error: string | null = null;

  // Template-related properties
  availableTemplates: ResumeTemplate[] = [];

  @ViewChild('resumeContent') resumeContentEl!: ElementRef;
  isLoadingPdf = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resumeService: ResumeService,
    private templateService: TemplateService,
    private pdfService: PdfService
  ) {}
  ngOnInit(): void {
    // Load available templates
    this.availableTemplates = this.templateService.getTemplates(); // Check if we have resumeData input (used as child component in resume builder)
    if (this.resumeData) {
      // Use the provided resumeData and selectedTemplate
      this.resume = this.resumeData;
      this.personalDetails = this.resumeData.personalDetails;
      this.informationSummary = this.resumeData.informationSummary;
      this.languages = this.resumeData.languages;
      this.workExperience = this.resumeData.workExperience;
      this.education = this.resumeData.education;
      this.workshops = this.resumeData.workshops;

      // Set template or use default
      if (!this.selectedTemplate) {
        this.setDefaultTemplate();
      }
      this.isLoading = false;
      return;
    }

    // Check if we're being used as a standalone page (route has ID parameter)
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.resumeId = params['id'];
        this.loadResumeData();
      } else {
        // Being used as a child component with @Input properties
        this.setDefaultTemplate();
        this.isLoading = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes to resumeData input for live preview updates
    if (changes['resumeData'] && changes['resumeData'].currentValue) {
      const resumeData = changes['resumeData'].currentValue;

      // Update all component properties when resumeData changes
      this.resume = resumeData;
      this.personalDetails = resumeData.personalDetails;
      this.informationSummary = resumeData.informationSummary;
      this.languages = resumeData.languages;
      this.workExperience = resumeData.workExperience;
      this.education = resumeData.education;
      this.workshops = resumeData.workshops;

      console.log(
        'ResumePreviewComponent: Input data updated via ngOnChanges',
        {
          personalDetails: this.personalDetails,
          informationSummary: this.informationSummary,
          languages: this.languages,
          workExperience: this.workExperience,
          education: this.education,
          workshops: this.workshops,
        }
      );
    }

    // Handle template changes
    if (
      changes['selectedTemplate'] &&
      changes['selectedTemplate'].currentValue
    ) {
      console.log(
        'ResumePreviewComponent: Template changed to',
        changes['selectedTemplate'].currentValue
      );
    }
  }

  loadResumeData(): void {
    if (!this.resumeId) return;

    this.isLoading = true;
    this.error = null;

    this.resumeService.getResumeById(this.resumeId).subscribe({
      next: (resume) => {
        this.resume = resume;
        // Map resume data to component properties
        this.personalDetails = resume.personalDetails;
        this.informationSummary = resume.informationSummary;
        this.languages = resume.languages || [];
        this.workExperience = resume.workExperience || [];
        this.workshops = resume.workshops || [];
        this.education = resume.education || [];

        // Set template based on resume data or use default
        this.setTemplateFromResume(resume);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading resume:', error);
        this.error = 'Failed to load resume. Please try again.';
        this.isLoading = false;
      },
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  editResume(): void {
    if (this.resumeId) {
      this.router.navigate(['/resume', this.resumeId]);
    }
  }

  // Placeholder methods for buttons in the preview panel
  showPreviewAlert(): void {
    const allData = {
      personalDetails: this.personalDetails,
      informationSummary: this.informationSummary,
      languages: this.languages,
      workExperience: this.workExperience,
      workshops: this.workshops,
      education: this.education,
    };
    // Simple alert showing the data. A real preview would render HTML.
    alert('Preview Data:\n' + JSON.stringify(allData, null, 2));
  }
  async triggerPrintToPdf(): Promise<void> {
    this.isLoadingPdf = true;

    try {
      if (this.resumeId) {
        // Generate PDF for saved resume
        const resumeName = this.personalDetails?.name || 'Resume';
        const templateId = this.selectedTemplate?.id || 'classic';

        await this.pdfService.downloadResumePDF(
          this.resumeId,
          resumeName,
          templateId
        );
        console.log('PDF generated and downloaded successfully');
      } else if (this.resumeData || this.personalDetails) {
        // Generate PDF from current data
        const currentResumeData = this.getCurrentResumeData();
        const templateId = this.selectedTemplate?.id || 'classic';

        await this.pdfService.downloadPDFFromData(
          currentResumeData,
          templateId
        );
        console.log('PDF generated from current data successfully');
      } else {
        console.error('No resume data available for PDF generation');
        alert('No resume data available. Please create a resume first.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      this.isLoadingPdf = false;
    }
  }

  // Helper method to get current resume data
  private getCurrentResumeData(): any {
    return {
      personalDetails: this.personalDetails,
      informationSummary: this.informationSummary,
      languages: this.languages || [],
      workExperience: this.workExperience || [],
      education: this.education || [],
      workshops: this.workshops || [],
    };
  }
  // Template-related methods
  setDefaultTemplate(): void {
    if (!this.selectedTemplate) {
      this.selectedTemplate = this.templateService.getDefaultTemplate();
    }
  }

  setTemplateFromResume(resume: any): void {
    if (resume.templateId) {
      const template = this.templateService.getTemplate(resume.templateId);
      this.selectedTemplate =
        template || this.templateService.getDefaultTemplate();
    } else {
      this.setDefaultTemplate();
    }
  }

  changeTemplate(templateId: string): void {
    const template = this.templateService.getTemplate(templateId);
    if (template) {
      this.selectedTemplate = template;
      // If we have a resume ID, update the resume with the new template
      if (this.resumeId && this.resume) {
        this.resume.templateId = templateId;
        this.resumeService.updateResume(this.resumeId, this.resume).subscribe({
          next: (updatedResume) => {
            console.log('Template updated successfully');
          },
          error: (error) => {
            console.error('Error updating template:', error);
          },
        });
      }
    }
  }
}
