import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonalDetails } from '../models/personal-details.model';
import { Language } from '../models/language.model';
import { WorkExperience } from '../models/work-experience.model';
import { Workshop } from '../models/workshop.model';
import { Education } from '../models/education.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LanguageEntryComponent } from './language-entry/language-entry.component';
import { WorkExperienceEntryComponent } from './work-experience-entry/work-experience-entry.component';
import { WorkshopEntryComponent } from './workshop-entry/workshop-entry.component';
import { EducationEntryComponent } from './education-entry/education-entry.component';
import { ResumeService } from '../services/resume.service';
import { AIService } from '../services/ai.service';
import { TemplateService, ResumeTemplate } from '../services/template.service';
import { AIInputDialogComponent } from './ai-input-dialog/ai-input-dialog.component';
import { TemplateSelectorComponent } from './template-selector/template-selector.component';

@Component({
  selector: 'app-resume-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LanguageEntryComponent,
    WorkExperienceEntryComponent,
    WorkshopEntryComponent,
    EducationEntryComponent,
    AIInputDialogComponent,
    TemplateSelectorComponent,
  ],
  templateUrl: './resume-form.component.html',
  styleUrls: ['./resume-form.component.css'], // or .scss
})
export class ResumeFormComponent implements OnInit {
  // --- Data Properties --
  personalDetails: PersonalDetails = {
    name: '',
    birthDate: '',
    address: '',
    familyStatus: '',
    email: '',
    phone: '',
    nationality: '',
    itSkills: '',
    strengths: '',
    imageUrl: null,
  };
  informationSummary: string = ''; // Renamed from 'information' for clarity

  // For dynamic sections, initialize with one empty item for user convenience
  languages: Language[] = [{ name: '', level: '' }];
  workExperience: WorkExperience[] = [
    { company: '', position: '', date: '', description: '' },
  ];
  workshops: Workshop[] = [{ title: '', place: '', date: '' }];
  education: Education[] = [{ school: '', degree: '', place: '', date: '' }];

  // Output event to notify parent (AppComponent) of data changes
  @Output() dataChanged = new EventEmitter<any>();

  // Add resumeId property at the top of the class with other properties
  resumeId: string = '';

  showAIDialog = false;

  // Template-related properties
  selectedTemplate: ResumeTemplate | null = null;
  showTemplateSelector = false;

  constructor(
    private resumeService: ResumeService,
    private aiService: AIService,
    private templateService: TemplateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for route parameters to load existing resume
    this.route.params.subscribe((params) => {
      if (params['id'] && params['id'] !== 'new') {
        this.loadResume(params['id']);
      }
    });

    // Set default template
    this.setDefaultTemplate();

    // Optionally, emit initial data when component loads
    this.emitDataChanges();
  }

  // --- Helper to emit all data ---
  private emitDataChanges(): void {
    const currentResumeData = {
      personalDetails: { ...this.personalDetails }, // Create a shallow copy
      informationSummary: this.informationSummary,
      languages: [...this.languages.map((l) => ({ ...l }))], // Deep copy array of objects
      workExperience: [...this.workExperience.map((w) => ({ ...w }))],
      workshops: [...this.workshops.map((w) => ({ ...w }))],
      education: [...this.education.map((e) => ({ ...e }))],
      templateId: this.selectedTemplate?.id || 'classic',
    };
    this.dataChanged.emit(currentResumeData);
  }

  // --- General Form Input Change Handler ---
  // Call this after any ngModel change if direct property binding doesn't trigger detection enough for parent
  onFieldChange(): void {
    this.emitDataChanges();
  }

  // --- Image Handling ---
  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.personalDetails.imageUrl = e.target.result;
        this.emitDataChanges(); // Emit after image is loaded
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.personalDetails.imageUrl = null;
    // Reset the file input (a bit hacky in plain JS/TS, easier with Angular Forms API later)
    const fileInput = document.getElementById(
      'file-upload-input'
    ) as HTMLInputElement; // Add an ID to your file input
    if (fileInput) {
      fileInput.value = '';
    }
    this.emitDataChanges();
  }

  // --- "AI Fill" and "Reset" ---
  async fillWithAI() {
    this.showAIDialog = true;
  }

  async handleAIInput(userInput: string) {
    try {
      // Show loading state
      const loadingToast = alert('Generating resume content...');

      // Generate all sections in parallel
      const [personalDetails, summary, workExperience, education, languages] =
        await Promise.all([
          this.aiService.generatePersonalDetails(userInput),
          this.aiService.generateInformationSummary(userInput),
          this.aiService.generateWorkExperience(userInput),
          this.aiService.generateEducation(userInput),
          this.aiService.generateLanguages(userInput),
        ]);

      // Update personal details
      this.personalDetails = {
        ...this.personalDetails,
        ...personalDetails,
      };

      // Update summary
      this.informationSummary = summary;

      // Update work experience
      this.workExperience = workExperience;

      // Update education
      this.education = education;

      // Update languages
      this.languages = languages;

      // Notify of changes
      this.emitDataChanges();

      // Hide loading state and show success message
      alert('Resume content generated successfully!');
    } catch (error) {
      alert('Error generating resume content. Please try again.');
    } finally {
      this.showAIDialog = false;
    }
  }

  handleAICancel() {
    this.showAIDialog = false;
  }

  // Replace the existing fillWithAIDemo method with this:
  fillWithAIDemo(): void {
    this.fillWithAI();
  }

  resetForm(): void {
    this.personalDetails = {
      name: '',
      birthDate: '',
      address: '',
      familyStatus: '',
      email: '',
      phone: '',
      nationality: '',
      itSkills: '',
      strengths: '',
      imageUrl: null,
    };
    this.informationSummary = '';
    this.languages = [{ name: '', level: '' }];
    this.workExperience = [
      { company: '', position: '', date: '', description: '' },
    ];
    this.workshops = [{ title: '', place: '', date: '' }];
    this.education = [{ school: '', degree: '', place: '', date: '' }];
    this.removeImage(); // Also clears the file input if an image was selected
    alert('Form Reset!');
    this.emitDataChanges();
  }

  // --- Placeholder methods for dynamic sections (to be expanded in Phase 3) ---
  // We'll add these now so the template doesn't break, but the actual logic for
  // adding/removing will be more refined when we create child components.
  // Add this method inside ResumeFormComponent class
  trackByIndex(index: number, item: any): any {
    return index; // Or a unique ID if your items have one
  }
  addLanguage(): void {
    this.languages.push({ name: '', level: '' });
    this.emitDataChanges();
  }
  removeLanguage(index: number): void {
    this.languages.splice(index, 1);
    this.emitDataChanges();
  }

  addWorkExperience(): void {
    this.workExperience.push({
      company: '',
      position: '',
      date: '',
      description: '',
    });
    this.emitDataChanges();
  }
  removeWorkExperience(index: number): void {
    this.workExperience.splice(index, 1);
    this.emitDataChanges();
  }

  addWorkshop(): void {
    this.workshops.push({ title: '', place: '', date: '' });
    this.emitDataChanges();
  }
  removeWorkshop(index: number): void {
    this.workshops.splice(index, 1);
    this.emitDataChanges();
  }

  addEducation(): void {
    this.education.push({ school: '', degree: '', place: '', date: '' });
    this.emitDataChanges();
  }
  removeEducation(index: number): void {
    this.education.splice(index, 1);
    this.emitDataChanges();
  }
  // NEW method to handle changes from the child component
  handleLanguageEntryChange(updatedLanguage: Language, index: number): void {
    // Ensure the change is reflected in the main languages array.
    // This might already be handled by [(ngModel)] if the object reference is the same.
    // However, explicitly updating can be safer for change detection or if you need to do more.
    // this.languages[index] = updatedLanguage; // This line might not be strictly necessary
    // if language is passed by reference and ngModel works directly on it.
    // But it's good for clarity or if further processing is needed.
    this.emitDataChanges(); // Crucial: notify AppComponent that overall data changed
  }

  handleWorkExperienceEntryChange(
    updatedExperience: WorkExperience,
    index: number
  ): void {
    // this.workExperience[index] = updatedExperience; // As before, ngModel might handle this.
    this.emitDataChanges(); // Notify AppComponent
  }
  handleWorkshopEntryChange(updatedWorkshop: Workshop, index: number): void {
    this.emitDataChanges(); // Notify AppComponent
  }
  handleEducationEntryChange(
    updatedEducationItem: Education,
    index: number
  ): void {
    this.emitDataChanges(); // Notify AppComponent
  }

  // Navigation method
  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Add new methods for API interactions
  saveResume() {
    const resumeData = {
      title: this.personalDetails.name
        ? `${this.personalDetails.name}'s Resume`
        : 'Untitled Resume',
      personalDetails: this.personalDetails,
      informationSummary: this.informationSummary,
      languages: this.languages,
      workExperience: this.workExperience,
      workshops: this.workshops,
      education: this.education,
      templateId: this.selectedTemplate?.id || 'classic',
    };

    // If we have an existing resumeId, update it, otherwise create new
    if (this.resumeId) {
      this.resumeService.updateResume(this.resumeId, resumeData).subscribe({
        next: (response) => {
          alert('Resume updated successfully!');
        },
        error: (error) => {
          alert('Error updating resume. Please try again.');
        },
      });
    } else {
      this.resumeService.createResume(resumeData).subscribe({
        next: (response) => {
          this.resumeId = response.id || response._id; // Store the ID for future updates
          alert('Resume saved successfully!');
        },
        error: (error) => {
          // Provide more specific error messages
          if (error.status === 401) {
            alert('You are not authenticated. Please log in again.');
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            alert('You do not have permission to save resumes.');
          } else if (error.status === 400) {
            alert('Invalid resume data. Please check your inputs.');
          } else if (error.status === 0) {
            alert(
              'Cannot connect to server. Please make sure the server is running.'
            );
          } else {
            alert('Error saving resume. Please try again.');
          }
        },
      });
    }
  }

  loadResume(id: string) {
    this.resumeService.getResumeById(id).subscribe({
      next: (resume) => {
        this.resumeId = id;
        this.personalDetails = resume.personalDetails || {
          name: '',
          birthDate: '',
          address: '',
          familyStatus: '',
          email: '',
          phone: '',
          nationality: '',
          itSkills: '',
          strengths: '',
          imageUrl: null,
        };
        this.informationSummary = resume.informationSummary || '';
        this.languages = resume.languages || [{ name: '', level: '' }];
        this.workExperience = resume.workExperience || [
          { company: '', position: '', date: '', description: '' },
        ];
        this.workshops = resume.workshops || [
          { title: '', place: '', date: '' },
        ];
        this.education = resume.education || [
          { school: '', degree: '', place: '', date: '' },
        ];

        // Set template based on loaded resume
        if (resume.templateId) {
          const templates = this.templateService.getTemplates();
          this.selectedTemplate =
            templates.find((t) => t.id === resume.templateId) || templates[0];
        } else {
          this.setDefaultTemplate();
        }

        this.emitDataChanges();
      },
      error: (error) => {
        alert('Error loading resume. Please try again.');
      },
    });
  }

  deleteResume() {
    if (!this.resumeId) {
      alert('No resume to delete');
      return;
    }

    if (confirm('Are you sure you want to delete this resume?')) {
      this.resumeService.deleteResume(this.resumeId).subscribe({
        next: (response) => {
          this.resetForm();
          this.resumeId = '';
          alert('Resume deleted successfully!');
        },
        error: (error) => {
          alert('Error deleting resume. Please try again.');
        },
      });
    }
  }

  // Template-related methods
  setDefaultTemplate(): void {
    const templates = this.templateService.getTemplates();
    this.selectedTemplate =
      templates.find((t) => t.id === 'classic') || templates[0];
  }

  onTemplateSelected(template: ResumeTemplate): void {
    this.selectedTemplate = template;
    this.showTemplateSelector = false;
    this.emitDataChanges();
  }

  toggleTemplateSelector(): void {
    this.showTemplateSelector = !this.showTemplateSelector;
  }
}
