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
  isEmbedded = false; // New property to track if embedded

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resumeService: ResumeService,
    private templateService: TemplateService
  ) {}
  ngOnInit(): void {
    // Load available templates
    this.availableTemplates = this.templateService.getTemplates();
    if (this.resumeData) {
      this.isEmbedded = true; // Set to true if resumeData is present
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
        this.isEmbedded = false; // Standalone page, not embedded
        this.loadResumeData();
      } else {
        // Being used as a child component with @Input properties
        // This case implies it's embedded if not caught by resumeData check earlier,
        // but the primary check is via resumeData input.
        if (!this.resumeData) {
          // If resumeData wasn't provided, it might be an uninitialized embed
          this.isEmbedded = true;
        }
        this.setDefaultTemplate();
        this.isLoading = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle changes to resumeData input for live preview updates
    if (changes['resumeData'] && changes['resumeData'].currentValue) {
      this.isEmbedded = true; // Set to true if resumeData is present
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
  triggerPrintToPdf(): void {
    this.isLoadingPdf = true;

    // Add printing class to body for enhanced print styles
    document.body.classList.add('printing');

    // Make sure the content is visible and properly sized
    if (this.resumeContentEl) {
      // Set inline styles to ensure content is visible during print
      const contentElement = this.resumeContentEl.nativeElement;
      contentElement.style.display = 'block';
      contentElement.style.visibility = 'visible';
      contentElement.style.position = 'relative';
      contentElement.style.overflow = 'visible';
      contentElement.style.height = 'auto';
      contentElement.style.minHeight = 'auto';
      contentElement.style.maxHeight = 'none';
    }

    // Set a timeout to reset the loading state and remove printing class
    setTimeout(() => {
      this.isLoadingPdf = false;
      document.body.classList.remove('printing');
    }, 2000);

    // Longer delay to ensure styles are properly applied before print dialog
    setTimeout(() => {
      window.print();
    }, 500);
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
