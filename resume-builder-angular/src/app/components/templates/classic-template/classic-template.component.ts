import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetails } from '../../../models/personal-details.model';
import { Language } from '../../../models/language.model';
import { WorkExperience } from '../../../models/work-experience.model';
import { Workshop } from '../../../models/workshop.model';
import { Education } from '../../../models/education.model';

@Component({
  selector: 'app-classic-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Classic Professional Template -->
    <div class="classic-template bg-white p-6 md:p-8 font-inter">
      <!-- A. RESUME HEADER: Name, Contact, Image -->
      <header
        class="mb-8 text-center md:text-left print:mb-6"
        *ngIf="personalDetails"
      >
        <div class="md:flex md:items-center md:gap-6">
          <div
            *ngIf="personalDetails?.imageUrl"
            class="mb-4 md:mb-0 print:mb-2"
          >
            <img
              [src]="personalDetails?.imageUrl"
              alt="Profile Photo"
              class="w-28 h-28 sm:w-32 sm:h-32 rounded-full mx-auto md:mx-0 object-cover border-4 border-blue-200 shadow-md print:w-24 print:h-24 print:border-2"
            />
          </div>
          <div class="flex-1">
            <h1
              class="text-3xl sm:text-4xl font-bold text-blue-700 tracking-tight print:text-2xl"
            >
              {{ personalDetails.name || 'Your Name' }}
            </h1>

            <div
              class="mt-2 text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:flex-wrap justify-center md:justify-start gap-x-3 gap-y-1 print:text-xs print:gap-x-2"
            >
              <span *ngIf="personalDetails.phone" class="flex items-center">
                <svg
                  class="w-3 h-3 mr-1.5 print:w-2.5 print:h-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  ></path>
                </svg>
                {{ personalDetails.phone }}
              </span>
              <span *ngIf="personalDetails.email" class="flex items-center">
                <svg
                  class="w-3 h-3 mr-1.5 print:w-2.5 print:h-2.5"
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
              </span>
              <span *ngIf="personalDetails.address" class="flex items-center">
                <svg
                  class="w-3 h-3 mr-1.5 print:w-2.5 print:h-2.5"
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
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- B. SUMMARY / PROFILE -->
      <section class="mb-6 print:mb-4" *ngIf="informationSummary">
        <h2 class="section-title">Profile Summary</h2>
        <p
          class="text-sm text-gray-700 leading-relaxed whitespace-pre-line print:text-xs"
        >
          {{ informationSummary }}
        </p>
      </section>

      <!-- C. WORK EXPERIENCE -->
      <section
        class="mb-6 print:mb-4"
        *ngIf="workExperience && workExperience.length > 0"
      >
        <h2 class="section-title">Work Experience</h2>
        <div
          *ngFor="let exp of workExperience"
          class="mb-4 print:mb-3 last:mb-0"
        >
          <div
            class="flex flex-col sm:flex-row justify-between sm:items-center"
          >
            <h3 class="text-md font-semibold text-gray-800 print:text-sm">
              {{ exp.position || 'Job Title' }}
            </h3>
            <p class="text-xs text-gray-500 mt-0.5 sm:mt-0 print:text-2xs">
              {{ exp.date || 'Date Range' }}
            </p>
          </div>
          <p class="text-sm font-medium text-blue-600 mb-1 print:text-xs">
            {{ exp.company || 'Company Name' }}
          </p>
          <p
            *ngIf="exp.description"
            class="text-xs text-gray-600 leading-normal whitespace-pre-line print:text-2xs"
          >
            {{ exp.description }}
          </p>
        </div>
      </section>

      <!-- D. EDUCATION -->
      <section
        class="mb-6 print:mb-4"
        *ngIf="education && education.length > 0"
      >
        <h2 class="section-title">Education</h2>
        <div *ngFor="let edu of education" class="mb-4 print:mb-3 last:mb-0">
          <div
            class="flex flex-col sm:flex-row justify-between sm:items-center"
          >
            <h3 class="text-md font-semibold text-gray-800 print:text-sm">
              {{ edu.degree || 'Degree / Field of Study' }}
            </h3>
            <p class="text-xs text-gray-500 mt-0.5 sm:mt-0 print:text-2xs">
              {{ edu.date || 'Date Range' }}
            </p>
          </div>
          <p class="text-sm font-medium text-blue-600 mb-0.5 print:text-xs">
            {{ edu.school || 'Institution Name' }}
          </p>
          <p *ngIf="edu.place" class="text-xs text-gray-500 print:text-2xs">
            {{ edu.place }}
          </p>
        </div>
      </section>

      <!-- E. SKILLS & LANGUAGES -->
      <div class="grid md:grid-cols-2 gap-x-8 print:grid-cols-2">
        <section
          class="mb-6 print:mb-4"
          *ngIf="
            personalDetails &&
            (personalDetails.itSkills || personalDetails.strengths)
          "
        >
          <h2 class="section-title">Skills</h2>
          <div *ngIf="personalDetails.itSkills" class="mb-2 print:mb-1">
            <h4
              class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 print:text-2xs"
            >
              Technical Skills
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-line print:text-xs">
              {{ personalDetails.itSkills }}
            </p>
          </div>
          <div *ngIf="personalDetails.strengths" class="mt-2">
            <h4
              class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 print:text-2xs"
            >
              Strengths
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-line print:text-xs">
              {{ personalDetails.strengths }}
            </p>
          </div>
        </section>

        <section
          class="mb-6 print:mb-4"
          *ngIf="languages && languages.length > 0"
        >
          <h2 class="section-title">Languages</h2>
          <ul class="list-none space-y-1">
            <li
              *ngFor="let lang of languages"
              class="text-sm text-gray-700 print:text-xs"
            >
              <span class="font-medium">{{ lang.name || 'Language' }}:</span>
              {{ lang.level || 'Level' }}
            </li>
          </ul>
        </section>
      </div>

      <!-- F. WORKSHOPS / CERTIFICATIONS -->
      <section
        class="mb-6 print:mb-4"
        *ngIf="workshops && workshops.length > 0"
      >
        <h2 class="section-title">Workshops & Certifications</h2>
        <div
          *ngFor="let workshop of workshops"
          class="mb-3 print:mb-2 last:mb-0"
        >
          <div
            class="flex flex-col sm:flex-row justify-between sm:items-center"
          >
            <h3 class="text-sm font-semibold text-gray-800 print:text-xs">
              {{ workshop.title || 'Workshop/Certification Title' }}
            </h3>
            <p class="text-xs text-gray-500 mt-0.5 sm:mt-0 print:text-2xs">
              {{ workshop.date || 'Date' }}
            </p>
          </div>
          <p class="text-xs text-blue-600 print:text-2xs">
            {{ workshop.place || 'Issuing Organization / Place' }}
          </p>
        </div>
      </section>

      <!-- G. Additional Information -->
      <section
        *ngIf="
          personalDetails &&
          (personalDetails.birthDate ||
            personalDetails.nationality ||
            personalDetails.familyStatus)
        "
      >
        <h2 class="section-title">Additional Information</h2>
        <ul class="list-none space-y-1 text-sm text-gray-700 print:text-xs">
          <li *ngIf="personalDetails.birthDate">
            <strong>Birth Date:</strong> {{ personalDetails.birthDate }}
          </li>
          <li *ngIf="personalDetails.nationality">
            <strong>Nationality:</strong> {{ personalDetails.nationality }}
          </li>
          <li *ngIf="personalDetails.familyStatus">
            <strong>Family Status:</strong> {{ personalDetails.familyStatus }}
          </li>
        </ul>
      </section>
    </div>
  `,
  styles: [
    `
      .classic-template {
        font-family: 'Inter', sans-serif;
      }

      .section-title {
        @apply text-lg font-semibold text-blue-600 uppercase tracking-wider pb-1 mb-3 border-b-2 border-blue-200;
        @apply print:text-sm print:mb-2 print:pb-0.5 print:border-b print:border-gray-300 print:text-black;
      }

      @media print {
        .classic-template {
          font-size: 12px;
        }
      }
    `,
  ],
})
export class ClassicTemplateComponent {
  @Input() personalDetails?: PersonalDetails;
  @Input() informationSummary?: string;
  @Input() languages?: Language[];
  @Input() workExperience?: WorkExperience[];
  @Input() workshops?: Workshop[];
  @Input() education?: Education[];
}
