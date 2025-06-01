import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetails } from '../../../models/personal-details.model';
import { Language } from '../../../models/language.model';
import { WorkExperience } from '../../../models/work-experience.model';
import { Workshop } from '../../../models/workshop.model';
import { Education } from '../../../models/education.model';

@Component({
  selector: 'app-executive-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Executive Template with Sidebar -->
    <div class="executive-template bg-white font-merriweather min-h-full">
      <div class="grid md:grid-cols-4 min-h-full">
        <!-- Left Sidebar -->
        <div class="bg-emerald-700 text-white p-6 md:col-span-1">
          <!-- Profile Image -->
          <div class="text-center mb-6" *ngIf="personalDetails?.imageUrl">
            <img
              [src]="personalDetails?.imageUrl"
              alt="Profile Photo"
              class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-200"
            />
          </div>

          <!-- Contact Information -->
          <section class="mb-6" *ngIf="personalDetails">
            <h3 class="sidebar-section-title">Contact</h3>
            <div class="space-y-3 text-sm">
              <div *ngIf="personalDetails.email" class="flex items-start">
                <svg
                  class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  ></path>
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  ></path>
                </svg>
                <span class="break-all">{{ personalDetails.email }}</span>
              </div>
              <div *ngIf="personalDetails.phone" class="flex items-center">
                <svg
                  class="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  ></path>
                </svg>
                <span>{{ personalDetails.phone }}</span>
              </div>
              <div *ngIf="personalDetails.address" class="flex items-start">
                <svg
                  class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>{{ personalDetails.address }}</span>
              </div>
            </div>
          </section>

          <!-- Skills -->
          <section
            class="mb-6"
            *ngIf="
              personalDetails &&
              (personalDetails.itSkills || personalDetails.strengths)
            "
          >
            <h3 class="sidebar-section-title">Expertise</h3>
            <div *ngIf="personalDetails.itSkills" class="mb-4">
              <h4 class="text-emerald-200 font-medium mb-2 text-sm">
                Technical Skills
              </h4>
              <div class="space-y-1">
                <div
                  *ngFor="let skill of getSkillsArray(personalDetails.itSkills)"
                  class="text-xs bg-emerald-600 px-2 py-1 rounded"
                >
                  {{ skill }}
                </div>
              </div>
            </div>
            <div *ngIf="personalDetails.strengths">
              <h4 class="text-emerald-200 font-medium mb-2 text-sm">
                Core Strengths
              </h4>
              <p class="text-xs leading-relaxed">
                {{ personalDetails.strengths }}
              </p>
            </div>
          </section>

          <!-- Languages -->
          <section class="mb-6" *ngIf="languages && languages.length > 0">
            <h3 class="sidebar-section-title">Languages</h3>
            <div class="space-y-2">
              <div *ngFor="let lang of languages" class="text-sm">
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ lang.name || 'Language' }}</span>
                  <span class="text-emerald-200 text-xs">{{
                    lang.level || 'Level'
                  }}</span>
                </div>
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
          >
            <h3 class="sidebar-section-title">Personal</h3>
            <div class="space-y-1 text-sm">
              <div *ngIf="personalDetails.birthDate">
                <span class="text-emerald-200">Birth Date:</span>
                <span class="block">{{ personalDetails.birthDate }}</span>
              </div>
              <div *ngIf="personalDetails.nationality">
                <span class="text-emerald-200">Nationality:</span>
                <span class="block">{{ personalDetails.nationality }}</span>
              </div>
              <div *ngIf="personalDetails.familyStatus">
                <span class="text-emerald-200">Status:</span>
                <span class="block">{{ personalDetails.familyStatus }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Main Content Area -->
        <div class="md:col-span-3 p-6 md:p-8">
          <!-- Header -->
          <header class="mb-8" *ngIf="personalDetails">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {{ personalDetails.name || 'Your Name' }}
            </h1>
            <div class="w-16 h-1 bg-emerald-600 rounded mb-4"></div>
          </header>

          <!-- Professional Summary -->
          <section class="mb-8" *ngIf="informationSummary">
            <h2 class="main-section-title">Executive Summary</h2>
            <p class="text-gray-700 leading-relaxed text-justify">
              {{ informationSummary }}
            </p>
          </section>

          <!-- Professional Experience -->
          <section
            class="mb-8"
            *ngIf="workExperience && workExperience.length > 0"
          >
            <h2 class="main-section-title">Professional Experience</h2>
            <div class="space-y-6">
              <div *ngFor="let exp of workExperience" class="relative">
                <div
                  class="flex flex-col md:flex-row md:justify-between md:items-start mb-2"
                >
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">
                      {{ exp.position || 'Position Title' }}
                    </h3>
                    <p class="text-emerald-700 font-medium">
                      {{ exp.company || 'Company Name' }}
                    </p>
                  </div>
                  <span class="text-gray-600 text-sm font-medium">
                    {{ exp.date || 'Date Range' }}
                  </span>
                </div>
                <p
                  *ngIf="exp.description"
                  class="text-gray-700 text-sm leading-relaxed text-justify"
                >
                  {{ exp.description }}
                </p>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section class="mb-8" *ngIf="education && education.length > 0">
            <h2 class="main-section-title">Education</h2>
            <div class="space-y-4">
              <div *ngFor="let edu of education">
                <div
                  class="flex flex-col md:flex-row md:justify-between md:items-start mb-1"
                >
                  <div>
                    <h3 class="font-semibold text-gray-800">
                      {{ edu.degree || 'Degree / Field of Study' }}
                    </h3>
                    <p class="text-emerald-700 font-medium">
                      {{ edu.school || 'Institution Name' }}
                    </p>
                    <p *ngIf="edu.place" class="text-gray-600 text-sm">
                      {{ edu.place }}
                    </p>
                  </div>
                  <span class="text-gray-600 text-sm">
                    {{ edu.date || 'Date Range' }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Professional Development -->
          <section *ngIf="workshops && workshops.length > 0">
            <h2 class="main-section-title">Professional Development</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div
                *ngFor="let workshop of workshops"
                class="border-l-4 border-emerald-600 pl-4"
              >
                <h4 class="font-medium text-gray-800">
                  {{ workshop.title || 'Workshop/Certification Title' }}
                </h4>
                <p class="text-emerald-700 text-sm">
                  {{ workshop.place || 'Organization' }}
                </p>
                <p class="text-gray-500 text-sm">
                  {{ workshop.date || 'Date' }}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .executive-template {
        font-family: 'Merriweather', serif;
      }

      .sidebar-section-title {
        color: white;
        font-weight: 700;
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #059669;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.875rem;
      }

      .main-section-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #047857;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #d1fae5;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      @media print {
        .executive-template {
          font-size: 12px;
        }

        .bg-emerald-700 {
          background-color: #047857 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .sidebar-section-title {
          color: white !important;
        }

        .main-section-title {
          color: black !important;
        }
      }
    `,
  ],
})
export class ExecutiveTemplateComponent {
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
