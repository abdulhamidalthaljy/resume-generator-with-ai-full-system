import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetails } from '../../../models/personal-details.model';
import { Language } from '../../../models/language.model';
import { WorkExperience } from '../../../models/work-experience.model';
import { Workshop } from '../../../models/workshop.model';
import { Education } from '../../../models/education.model';

@Component({
  selector: 'app-minimal-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Minimal Clean Template -->
    <div class="minimal-template bg-white p-6 md:p-8 font-source-sans">
      <!-- Header - Clean and Simple -->
      <header
        class="text-center border-b-2 border-gray-200 pb-6 mb-8"
        *ngIf="personalDetails"
      >
        <div *ngIf="personalDetails?.imageUrl" class="mb-4">
          <img
            [src]="personalDetails.imageUrl"
            alt="Profile Photo"
            class="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gray-300"
          />
        </div>

        <h1
          class="text-3xl md:text-4xl font-light text-gray-800 mb-2 tracking-wide"
        >
          {{ personalDetails.name || 'Your Name' }}
        </h1>

        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span *ngIf="personalDetails.email" class="flex items-center">
            <span class="mr-1">✉</span>
            {{ personalDetails.email }}
          </span>
          <span *ngIf="personalDetails.phone" class="flex items-center">
            <span class="mr-1">☎</span>
            {{ personalDetails.phone }}
          </span>
          <span *ngIf="personalDetails.address" class="flex items-center">
            <span class="mr-1">📍</span>
            {{ personalDetails.address }}
          </span>
        </div>
      </header>

      <!-- Summary -->
      <section class="mb-8" *ngIf="informationSummary">
        <h2 class="section-title">Summary</h2>
        <p class="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
          {{ informationSummary }}
        </p>
      </section>

      <!-- Work Experience -->
      <section class="mb-8" *ngIf="workExperience && workExperience.length > 0">
        <h2 class="section-title">Professional Experience</h2>
        <div class="space-y-6">
          <div *ngFor="let exp of workExperience" class="text-center">
            <h3 class="text-lg font-medium text-gray-800 mb-1">
              {{ exp.position || 'Job Title' }}
            </h3>
            <p class="text-gray-600 font-light mb-1">
              {{ exp.company || 'Company Name' }}
            </p>
            <p class="text-sm text-gray-500 mb-3">
              {{ exp.date || 'Date Range' }}
            </p>
            <p
              *ngIf="exp.description"
              class="text-gray-700 text-sm leading-relaxed max-w-3xl mx-auto"
            >
              {{ exp.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section class="mb-8" *ngIf="education && education.length > 0">
        <h2 class="section-title">Education</h2>
        <div class="space-y-4">
          <div *ngFor="let edu of education" class="text-center">
            <h3 class="text-lg font-medium text-gray-800">
              {{ edu.degree || 'Degree / Field of Study' }}
            </h3>
            <p class="text-gray-600 font-light">
              {{ edu.school || 'Institution Name' }}
            </p>
            <div class="flex justify-center gap-4 text-sm text-gray-500">
              <span *ngIf="edu.date">{{ edu.date }}</span>
              <span *ngIf="edu.place">{{ edu.place }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills and Languages in a clean grid -->
      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <!-- Skills -->
        <section
          *ngIf="
            personalDetails &&
            (personalDetails.itSkills || personalDetails.strengths)
          "
        >
          <h2 class="section-title">Skills</h2>
          <div class="text-center space-y-4">
            <div *ngIf="personalDetails.itSkills">
              <h4 class="font-medium text-gray-700 mb-2">Technical</h4>
              <div class="flex flex-wrap justify-center gap-2">
                <span
                  *ngFor="let skill of getSkillsArray(personalDetails.itSkills)"
                  class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div *ngIf="personalDetails.strengths">
              <h4 class="font-medium text-gray-700 mb-2">Strengths</h4>
              <p class="text-gray-600 text-sm">
                {{ personalDetails.strengths }}
              </p>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section *ngIf="languages && languages.length > 0">
          <h2 class="section-title">Languages</h2>
          <div class="text-center space-y-2">
            <div
              *ngFor="let lang of languages"
              class="flex justify-center items-center"
            >
              <span class="text-gray-700 font-medium mr-2">{{
                lang.name || 'Language'
              }}</span>
              <span class="text-gray-500 text-sm">{{
                lang.level || 'Level'
              }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Workshops/Certifications -->
      <section class="mb-8" *ngIf="workshops && workshops.length > 0">
        <h2 class="section-title">Certifications</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div
            *ngFor="let workshop of workshops"
            class="text-center p-3 border border-gray-200 rounded"
          >
            <h4 class="font-medium text-gray-800 mb-1">
              {{ workshop.title || 'Workshop/Certification Title' }}
            </h4>
            <p class="text-gray-600 text-sm">
              {{ workshop.place || 'Organization' }}
            </p>
            <p class="text-gray-500 text-xs">{{ workshop.date || 'Date' }}</p>
          </div>
        </div>
      </section>

      <!-- Additional Information -->
      <section
        *ngIf="
          personalDetails &&
          (personalDetails.birthDate ||
            personalDetails.nationality ||
            personalDetails.familyStatus)
        "
        class="text-center"
      >
        <h2 class="section-title">Additional Information</h2>
        <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <span *ngIf="personalDetails.birthDate">
            <strong>Born:</strong> {{ personalDetails.birthDate }}
          </span>
          <span *ngIf="personalDetails.nationality">
            <strong>Nationality:</strong> {{ personalDetails.nationality }}
          </span>
          <span *ngIf="personalDetails.familyStatus">
            <strong>Status:</strong> {{ personalDetails.familyStatus }}
          </span>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .minimal-template {
        font-family: 'Source Sans Pro', sans-serif;
        line-height: 1.6;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 300;
        color: #1f2937;
        text-align: center;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        position: relative;
      }

      .section-title::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 1px;
        background: #374151;
      }

      @media print {
        .minimal-template {
          font-size: 12px;
        }

        .section-title {
          color: black !important;
        }

        .section-title::after {
          background: black !important;
        }
      }
    `,
  ],
})
export class MinimalTemplateComponent {
  @Input() personalDetails?: PersonalDetails;
  @Input() informationSummary?: string;
  @Input() languages?: Language[];
  @Input() workExperience?: WorkExperience[];
  @Input() workshops?: Workshop[];
  @Input() education?: Education[];

  getSkillsArray(skills: string): string[] {
    return skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }
}
