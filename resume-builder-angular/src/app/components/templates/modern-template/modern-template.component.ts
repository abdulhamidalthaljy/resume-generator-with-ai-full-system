import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetails } from '../../../models/personal-details.model';
import { Language } from '../../../models/language.model';
import { WorkExperience } from '../../../models/work-experience.model';
import { Workshop } from '../../../models/workshop.model';
import { Education } from '../../../models/education.model';

@Component({
  selector: 'app-modern-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modern Creative Template -->
    <div class="modern-template bg-white font-poppins">
      <!-- Header with colored background -->
      <header
        class="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 md:p-8 print:bg-purple-600"
      >
        <div
          class="flex flex-col md:flex-row items-center gap-6"
          *ngIf="personalDetails"
        >
          <div *ngIf="personalDetails?.imageUrl">
            <img
              [src]="personalDetails?.imageUrl"
              alt="Profile Photo"
              class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
          <div class="text-center md:text-left flex-1">
            <h1 class="text-3xl md:text-4xl font-bold mb-2">
              {{ personalDetails.name || 'Your Name' }}
            </h1>
            <div class="text-purple-100 space-y-1 text-sm">
              <div
                *ngIf="personalDetails.email"
                class="flex items-center justify-center md:justify-start"
              >
                <svg
                  class="w-4 h-4 mr-2"
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
                {{ personalDetails.email }}
              </div>
              <div
                *ngIf="personalDetails.phone"
                class="flex items-center justify-center md:justify-start"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  ></path>
                </svg>
                {{ personalDetails.phone }}
              </div>
              <div
                *ngIf="personalDetails.address"
                class="flex items-center justify-center md:justify-start"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ personalDetails.address }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Two-column layout -->
      <div class="grid md:grid-cols-3 gap-6 p-6 md:p-8">
        <!-- Left column - Main content -->
        <div class="md:col-span-2 space-y-6">
          <!-- Profile Summary -->
          <section *ngIf="informationSummary">
            <h2 class="section-title">About Me</h2>
            <p class="text-gray-700 leading-relaxed text-sm">
              {{ informationSummary }}
            </p>
          </section>

          <!-- Work Experience -->
          <section *ngIf="workExperience && workExperience.length > 0">
            <h2 class="section-title">Experience</h2>
            <div class="space-y-4">
              <div *ngFor="let exp of workExperience" class="relative pl-6">
                <!-- Timeline dot -->
                <div
                  class="absolute left-0 top-1 w-3 h-3 bg-purple-600 rounded-full"
                ></div>
                <!-- Timeline line -->
                <div
                  class="absolute left-1.5 top-4 w-0.5 h-full bg-purple-200"
                ></div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-800">
                      {{ exp.position || 'Job Title' }}
                    </h3>
                    <span class="text-sm text-purple-600 font-medium">
                      {{ exp.date || 'Date Range' }}
                    </span>
                  </div>
                  <p class="text-purple-700 font-medium mb-2">
                    {{ exp.company || 'Company Name' }}
                  </p>
                  <p
                    *ngIf="exp.description"
                    class="text-gray-600 text-sm leading-relaxed"
                  >
                    {{ exp.description }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section *ngIf="education && education.length > 0">
            <h2 class="section-title">Education</h2>
            <div class="space-y-3">
              <div
                *ngFor="let edu of education"
                class="bg-purple-50 p-4 rounded-lg"
              >
                <div class="flex justify-between items-start mb-1">
                  <h3 class="font-semibold text-gray-800">
                    {{ edu.degree || 'Degree / Field of Study' }}
                  </h3>
                  <span class="text-sm text-purple-600">
                    {{ edu.date || 'Date Range' }}
                  </span>
                </div>
                <p class="text-purple-700 font-medium">
                  {{ edu.school || 'Institution Name' }}
                </p>
                <p *ngIf="edu.place" class="text-gray-600 text-sm">
                  {{ edu.place }}
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- Right column - Sidebar -->
        <div class="space-y-6">
          <!-- Skills -->
          <section
            *ngIf="
              personalDetails &&
              (personalDetails.itSkills || personalDetails.strengths)
            "
          >
            <h2 class="sidebar-title">Skills</h2>
            <div class="space-y-3">
              <div *ngIf="personalDetails.itSkills">
                <h4 class="font-medium text-purple-700 mb-2">
                  Technical Skills
                </h4>
                <div class="flex flex-wrap gap-1">
                  <span
                    *ngFor="
                      let skill of getSkillsArray(personalDetails.itSkills)
                    "
                    class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
              <div *ngIf="personalDetails.strengths">
                <h4 class="font-medium text-purple-700 mb-2">Strengths</h4>
                <p class="text-gray-700 text-sm">
                  {{ personalDetails.strengths }}
                </p>
              </div>
            </div>
          </section>

          <!-- Languages -->
          <section *ngIf="languages && languages.length > 0">
            <h2 class="sidebar-title">Languages</h2>
            <div class="space-y-2">
              <div
                *ngFor="let lang of languages"
                class="flex justify-between items-center"
              >
                <span class="text-gray-700 text-sm font-medium">{{
                  lang.name || 'Language'
                }}</span>
                <span class="text-purple-600 text-sm">{{
                  lang.level || 'Level'
                }}</span>
              </div>
            </div>
          </section>

          <!-- Workshops -->
          <section *ngIf="workshops && workshops.length > 0">
            <h2 class="sidebar-title">Certifications</h2>
            <div class="space-y-3">
              <div
                *ngFor="let workshop of workshops"
                class="border-l-3 border-purple-300 pl-3"
              >
                <h4 class="font-medium text-gray-800 text-sm">
                  {{ workshop.title || 'Workshop/Certification Title' }}
                </h4>
                <p class="text-purple-600 text-xs">
                  {{ workshop.place || 'Organization' }}
                </p>
                <p class="text-gray-500 text-xs">
                  {{ workshop.date || 'Date' }}
                </p>
              </div>
            </div>
          </section>

          <!-- Additional Info -->
          <section
            *ngIf="
              personalDetails &&
              (personalDetails.birthDate ||
                personalDetails.nationality ||
                personalDetails.familyStatus)
            "
          >
            <h2 class="sidebar-title">Personal Info</h2>
            <div class="space-y-1 text-sm">
              <div
                *ngIf="personalDetails.birthDate"
                class="flex justify-between"
              >
                <span class="text-gray-600">Birth Date</span>
                <span class="text-gray-800">{{
                  personalDetails.birthDate
                }}</span>
              </div>
              <div
                *ngIf="personalDetails.nationality"
                class="flex justify-between"
              >
                <span class="text-gray-600">Nationality</span>
                <span class="text-gray-800">{{
                  personalDetails.nationality
                }}</span>
              </div>
              <div
                *ngIf="personalDetails.familyStatus"
                class="flex justify-between"
              >
                <span class="text-gray-600">Status</span>
                <span class="text-gray-800">{{
                  personalDetails.familyStatus
                }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modern-template {
        font-family: 'Poppins', sans-serif;
      }

      .section-title {
        @apply text-xl font-bold text-purple-700 mb-4 relative;
      }

      .section-title::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 40px;
        height: 3px;
        background: linear-gradient(to right, #7c3aed, #c084fc);
        border-radius: 2px;
      }

      .sidebar-title {
        @apply text-lg font-bold text-purple-700 mb-3 pb-2 border-b-2 border-purple-200;
      }

      @media print {
        .modern-template {
          font-size: 12px;
        }

        .bg-gradient-to-r {
          background: #7c3aed !important;
        }
      }
    `,
  ],
})
export class ModernTemplateComponent {
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
