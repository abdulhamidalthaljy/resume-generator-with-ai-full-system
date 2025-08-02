import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ResumeService } from '../../services/resume.service';
import { TemplateService } from '../../services/template.service';
import { AIService } from '../../services/ai.service';
import { SocketService } from '../../services/socket.service';
import { PdfService } from '../../services/pdf.service';
import { Resume } from '../../models/resume.model';
import { PersonalDetails } from '../../models/personal-details.model';
import { WorkExperience } from '../../models/work-experience.model';
import { Education } from '../../models/education.model';
import { Language } from '../../models/language.model';
import { Workshop } from '../../models/workshop.model';

import { ResumePreviewComponent } from '../resume-preview/resume-preview.component';
import { LanguageEntryComponent } from '../language-entry/language-entry.component';
import { WorkExperienceEntryComponent } from '../work-experience-entry/work-experience-entry.component';
import { EducationEntryComponent } from '../education-entry/education-entry.component';
import { WorkshopEntryComponent } from '../workshop-entry/workshop-entry.component';
import { AIInputDialogComponent } from '../ai-input-dialog/ai-input-dialog.component';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ResumePreviewComponent,
    LanguageEntryComponent,
    WorkExperienceEntryComponent,
    EducationEntryComponent,
    WorkshopEntryComponent,
    AIInputDialogComponent,
  ],
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css'],
})
export class ResumeBuilderComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Current step in the process
  currentStep: 'template' | 'form' = 'template';

  // Template selection
  selectedTemplate: any = null;
  templates: any[] = [];

  // Resume data
  resumeId: string | null = null;
  personalDetails: PersonalDetails = {} as PersonalDetails;
  informationSummary: string = '';
  languages: Language[] = [{}] as Language[];
  workExperience: WorkExperience[] = [{}] as WorkExperience[];
  education: Education[] = [{}] as Education[];
  workshops: Workshop[] = [{}] as Workshop[];
  // Loading states
  isSaving = false;
  isLoading = false;
  lastSavedTime: Date | null = null;

  // AI Integration
  showAIDialog = false;

  constructor(
    private resumeService: ResumeService,
    private templateService: TemplateService,
    private aiService: AIService,
    private socketService: SocketService,
    private pdfService: PdfService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ResumeBuilderComponent ngOnInit called');
    this.templates = this.templateService.getTemplates();
    console.log('Templates loaded:', this.templates);

    // Check if we're editing an existing resume
    this.route.params.subscribe((params) => {
      console.log('Route params:', params);
      if (params['id']) {
        this.resumeId = params['id'];
        console.log('Resume ID found:', this.resumeId);
        this.loadExistingResume();
      } else {
        // New resume - start with template selection
        console.log('New resume - starting with template selection');
        this.currentStep = 'template';
      }
    });
  }

  // Template Selection Methods
  onTemplateSelected(template: any) {
    const oldTemplate = this.selectedTemplate?.name;
    this.selectedTemplate = template;
    this.currentStep = 'form';

    // Emit socket event for template selection
    if (oldTemplate && oldTemplate !== template.name) {
      this.socketService.emitTemplateChanged(oldTemplate, template.name);
    }
  }

  goBackToTemplateSelection() {
    this.currentStep = 'template';
  }
  // Form Data Methods
  onFieldChange() {
    // Trigger immediate change detection for live preview
    this.cdr.detectChanges();

    // Emit editing event to show user activity
    if (this.resumeId && this.selectedTemplate) {
      this.socketService.emitResumeEditing(
        this.resumeId,
        this.selectedTemplate.name
      );
    }

    // Auto-save after user stops typing (debounced)
    this.debouncedSave();
  }

  private debouncedSave = this.debounce(() => {
    if (this.resumeId) {
      this.autoSave();
    }
  }, 1000);

  private debounce(func: Function, wait: number) {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  // Image handling
  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert(
          'Image file is too large. Please choose an image smaller than 5MB.'
        );
        return;
      }

      // Compress image before storing
      this.compressImage(file, (compressedDataUrl: string) => {
        this.personalDetails.imageUrl = compressedDataUrl;
        this.onFieldChange();
      });
    }
  }

  // Compress image to reduce payload size
  private compressImage(file: File, callback: (dataUrl: string) => void) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set max dimensions for the compressed image
      const maxWidth = 400;
      const maxHeight = 400;

      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality

      console.log('Image compression:', {
        originalSize: file.size,
        compressedSize: compressedDataUrl.length,
        reduction:
          (((file.size - compressedDataUrl.length) / file.size) * 100).toFixed(
            1
          ) + '%',
      });

      callback(compressedDataUrl);
    };

    img.src = URL.createObjectURL(file);
  }

  removeImage() {
    this.personalDetails.imageUrl = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.onFieldChange();
  }

  // Dynamic form methods
  addLanguage() {
    this.languages.push({} as Language);
    this.onFieldChange();
  }

  removeLanguage(index: number) {
    if (this.languages.length > 1) {
      this.languages.splice(index, 1);
      this.onFieldChange();
    }
  }

  addWorkExperience() {
    this.workExperience.push({} as WorkExperience);
    this.onFieldChange();
  }

  removeWorkExperience(index: number) {
    if (this.workExperience.length > 1) {
      this.workExperience.splice(index, 1);
      this.onFieldChange();
    }
  }

  addEducation() {
    this.education.push({} as Education);
    this.onFieldChange();
  }

  removeEducation(index: number) {
    if (this.education.length > 1) {
      this.education.splice(index, 1);
      this.onFieldChange();
    }
  }

  addWorkshop() {
    this.workshops.push({} as Workshop);
    this.onFieldChange();
  }

  removeWorkshop(index: number) {
    this.workshops.splice(index, 1);
    this.onFieldChange();
  }

  // Handle child component changes
  handleLanguageEntryChange(language: Language, index: number) {
    this.languages[index] = language;
    this.onFieldChange();
  }

  handleWorkExperienceEntryChange(experience: WorkExperience, index: number) {
    this.workExperience[index] = experience;
    this.onFieldChange();
  }

  handleEducationEntryChange(education: Education, index: number) {
    this.education[index] = education;
    this.onFieldChange();
  }

  handleWorkshopEntryChange(workshop: Workshop, index: number) {
    this.workshops[index] = workshop;
    this.onFieldChange();
  }

  // Save methods
  async autoSave() {
    if (!this.resumeId) return;

    try {
      const resumeData = this.buildResumeData();
      await this.resumeService
        .updateResume(this.resumeId, resumeData)
        .toPromise();
      this.lastSavedTime = new Date();
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  async saveResume() {
    if (this.isSaving) return;

    this.isSaving = true;
    try {
      const resumeData = this.buildResumeData();
      const isNewResume = !this.resumeId;

      if (this.resumeId) {
        // Update existing resume
        await this.resumeService
          .updateResume(this.resumeId, resumeData)
          .toPromise();

        // Emit socket event for resume update
        this.socketService.emitResumeUpdated(
          this.personalDetails.name + "'s Resume" || 'Resume',
          this.selectedTemplate?.name || 'Default'
        );
      } else {
        // Create new resume
        const response = await this.resumeService
          .createResume(resumeData)
          .toPromise();
        this.resumeId = response._id;

        // Emit socket event for resume creation
        this.socketService.emitResumeCreated(
          this.personalDetails.name + "'s Resume" || 'New Resume',
          this.selectedTemplate?.name || 'Default'
        );

        // Update URL to reflect the new resume ID
        this.router.navigate(['/resume', this.resumeId], { replaceUrl: true });
      }

      this.lastSavedTime = new Date();
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }
  private buildResumeData(): Resume {
    return {
      personalDetails: this.personalDetails,
      informationSummary: this.informationSummary,
      languages: this.languages.filter((lang) => lang.name?.trim()),
      workExperience: this.workExperience.filter((exp) => exp.position?.trim()),
      education: this.education.filter((edu) => edu.degree?.trim()),
      workshops: this.workshops.filter((ws) => ws.title?.trim()),
      templateId: this.selectedTemplate?.id || 'classic',
    };
  }

  private async loadExistingResume() {
    if (!this.resumeId) {
      console.error('No resume ID provided');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.isLoading = true;
    try {
      console.log('Loading resume with ID:', this.resumeId);
      const resume = await this.resumeService
        .getResumeById(this.resumeId)
        .toPromise();
      console.log('Loaded resume data:', resume);

      // Load resume data
      this.personalDetails = resume.personalDetails || ({} as PersonalDetails);
      this.informationSummary = resume.informationSummary || '';
      this.languages = resume.languages?.length
        ? resume.languages
        : ([{}] as Language[]);
      this.workExperience = resume.workExperience?.length
        ? resume.workExperience
        : ([{}] as WorkExperience[]);
      this.education = resume.education?.length
        ? resume.education
        : ([{}] as Education[]);
      this.workshops = resume.workshops || [];

      // Set template
      const templateId = resume.templateId || 'classic';
      this.selectedTemplate =
        this.templates.find((t) => t.id === templateId) || this.templates[0];

      // Skip template selection step
      this.currentStep = 'form';

      // Trigger change detection to update the UI
      this.cdr.detectChanges();

      console.log('Resume loaded successfully:', {
        personalDetails: this.personalDetails,
        informationSummary: this.informationSummary,
        languages: this.languages,
        workExperience: this.workExperience,
        education: this.education,
        workshops: this.workshops,
        selectedTemplate: this.selectedTemplate,
      });
    } catch (error) {
      console.error('Failed to load resume:', error);
      alert('Failed to load resume. Please try again.');
      this.router.navigate(['/dashboard']);
    } finally {
      this.isLoading = false;
    }
  }
  // Get current resume data for preview
  getCurrentResumeData(): Resume {
    const currentData = this.buildResumeData();
    console.log('getCurrentResumeData() called, returning:', currentData);
    return currentData;
  }

  // Track by functions for *ngFor optimization
  trackByIndex(index: number): number {
    return index;
  }
  // Clear all form data
  clearAllData() {
    if (
      confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      this.personalDetails = {} as PersonalDetails;
      this.informationSummary = '';
      this.languages = [{}] as Language[];
      this.workExperience = [{}] as WorkExperience[];
      this.education = [{}] as Education[];
      this.workshops = [];
      this.onFieldChange();
    }
  }

  // AI Integration Methods
  async fillWithAI() {
    this.showAIDialog = true;
  }
  async handleAIInput(userInput: string) {
    try {
      // Show loading state
      console.log('Starting AI generation for input:', userInput);

      // Generate all sections in parallel
      const [personalDetails, summary, workExperience, education, languages] =
        await Promise.all([
          this.aiService.generatePersonalDetails(userInput),
          this.aiService.generateInformationSummary(userInput),
          this.aiService.generateWorkExperience(userInput),
          this.aiService.generateEducation(userInput),
          this.aiService.generateLanguages(userInput),
        ]);

      console.log('AI Service Response:', {
        personalDetails,
        summary,
        workExperience,
        education,
        languages,
      });

      // Update personal details - ensure we preserve any existing data like imageUrl
      this.personalDetails = {
        ...this.personalDetails,
        ...personalDetails,
      };

      // Update summary
      this.informationSummary = summary;

      // Update arrays - ensure they're properly structured
      this.workExperience =
        Array.isArray(workExperience) && workExperience.length > 0
          ? workExperience
          : [{ company: '', position: '', date: '', description: '' }];

      this.education =
        Array.isArray(education) && education.length > 0
          ? education
          : [{ school: '', degree: '', place: '', date: '' }];

      this.languages =
        Array.isArray(languages) && languages.length > 0
          ? languages
          : [{ name: '', level: '' }];

      console.log('Updated component data:', {
        personalDetails: this.personalDetails,
        informationSummary: this.informationSummary,
        workExperience: this.workExperience,
        education: this.education,
        languages: this.languages,
      });

      // Force change detection
      this.cdr.detectChanges();

      // Trigger field change to update preview and auto-save
      this.onFieldChange();

      // Small delay to ensure change detection has completed
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);

      // Show success message
      alert('Resume content generated successfully!');
    } catch (error) {
      console.error('Error generating resume content:', error);
      alert('Error generating resume content. Please try again.');
    } finally {
      this.showAIDialog = false;
    }
  }

  handleAICancel() {
    this.showAIDialog = false;
  }
  fillWithAIDemo(): void {
    this.fillWithAI();
  }

  // Test method to verify preview updates work
  fillWithTestData(): void {
    console.log('Filling with test data...');

    this.personalDetails = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      birthDate: '01.01.1990',
      nationality: 'American',
      familyStatus: 'Single',
      itSkills: 'JavaScript, Angular, Node.js, MongoDB',
      strengths: 'Problem solving, Team collaboration, Leadership',
      imageUrl: '',
    };

    this.informationSummary =
      'Experienced software developer with 5+ years in web development. Proficient in modern JavaScript frameworks and backend technologies.';

    this.workExperience = [
      {
        company: 'Tech Company Inc.',
        position: 'Senior Developer',
        date: '2020 - Present',
        description:
          'Led development of web applications using Angular and Node.js',
      },
    ];

    this.education = [
      {
        school: 'University of Technology',
        degree: 'Bachelor of Computer Science',
        place: 'City, State',
        date: '2016 - 2020',
      },
    ];

    this.languages = [
      {
        name: 'English',
        level: 'Native',
      },
      {
        name: 'Spanish',
        level: 'Intermediate',
      },
    ];

    console.log('Test data applied:', {
      personalDetails: this.personalDetails,
      informationSummary: this.informationSummary,
      workExperience: this.workExperience,
      education: this.education,
      languages: this.languages,
    });

    // Force change detection
    this.cdr.detectChanges();
    this.onFieldChange();

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }
}
