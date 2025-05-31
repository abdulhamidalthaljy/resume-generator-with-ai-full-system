import { Component, Input, OnInit,ViewChild,ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf, json pipe

// Import all your models
import { PersonalDetails } from '../../models/personal-details.model';
import { Language } from '../../models/language.model';
import { WorkExperience } from '../../models/work-experience.model';
import { Workshop } from '../../models/workshop.model';
import { Education } from '../../models/education.model';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [
    CommonModule // Needed for *ngIf and the json pipe
  ],
  templateUrl: './resume-preview.component.html',
  styleUrls: ['./resume-preview.component.css']
})
export class ResumePreviewComponent implements OnInit {
  // Define Inputs for all data sections
  // Using '?' makes them optional, or provide default empty values
  // Or use '!' if you are certain the parent will always provide them.
  @Input() personalDetails?: PersonalDetails;
  @Input() informationSummary?: string;
  @Input() languages?: Language[];
  @Input() workExperience?: WorkExperience[];
  @Input() workshops?: Workshop[];
  @Input() education?: Education[];
  @ViewChild('resumeContent') resumeContentEl!: ElementRef; // Changed name to resumeContentEl
  isLoadingPdf = false; // To show a loading state

  constructor() { }

  ngOnInit(): void { }

  // Placeholder methods for buttons in the preview panel
  showPreviewAlert(): void {
    const allData = {
      personalDetails: this.personalDetails,
      informationSummary: this.informationSummary,
      languages: this.languages,
      workExperience: this.workExperience,
      workshops: this.workshops,
      education: this.education
    };
    // Simple alert showing the data. A real preview would render HTML.
    alert("Preview Data:\n" + JSON.stringify(allData, null, 2));

  }
    triggerPrintToPdf(): void {
    window.print();
  }}
  