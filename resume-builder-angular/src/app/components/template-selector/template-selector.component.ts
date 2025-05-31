import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TemplateService,
  ResumeTemplate,
} from '../../services/template.service';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-selector bg-white p-6 rounded-lg shadow-lg">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        Choose a Template
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          *ngFor="let template of templates"
          class="template-card cursor-pointer border-2 rounded-lg p-4 transition-all hover:shadow-md"
          [class.border-blue-500]="selectedTemplate?.id === template.id"
          [class.border-gray-200]="selectedTemplate?.id !== template.id"
          [class.bg-blue-50]="selectedTemplate?.id === template.id"
          (click)="selectTemplate(template)"
        >
          <!-- Template Preview -->
          <div
            class="template-preview mb-3 h-32 bg-gray-100 rounded flex items-center justify-center relative overflow-hidden"
          >
            <!-- Mini preview of the template style -->
            <div
              class="w-full h-full p-2 text-xs"
              [ngStyle]="getPreviewStyles(template)"
            >
              <div
                class="template-mini-header h-4 rounded mb-1"
                [ngStyle]="{ 'background-color': template.styles.headerColor }"
              ></div>
              <div class="template-mini-content space-y-1">
                <div class="h-1 bg-gray-300 rounded w-3/4"></div>
                <div class="h-1 bg-gray-300 rounded w-1/2"></div>
                <div class="h-1 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>

            <!-- Selected indicator -->
            <div
              *ngIf="selectedTemplate?.id === template.id"
              class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          <!-- Template Info -->
          <div class="template-info">
            <h4 class="font-medium text-gray-800 mb-1">{{ template.name }}</h4>
            <p class="text-xs text-gray-600 leading-tight">
              {{ template.description }}
            </p>

            <!-- Template features -->
            <div class="mt-2 flex flex-wrap gap-1">
              <span class="px-2 py-1 bg-gray-100 text-xs rounded-full">
                {{ template.styles.layout | titlecase }}
              </span>
              <span
                class="px-2 py-1 text-xs rounded-full text-white"
                [ngStyle]="{ 'background-color': template.styles.accentColor }"
              >
                {{ getColorName(template.styles.headerColor) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-600">
          <span *ngIf="selectedTemplate"
            >Selected: {{ selectedTemplate.name }}</span
          >
          <span *ngIf="!selectedTemplate">Select a template to continue</span>
        </div>

        <div class="flex gap-3">
          <button
            (click)="onCancel()"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            (click)="onConfirm()"
            [disabled]="!selectedTemplate"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .template-card {
        transition: all 0.2s ease;
      }

      .template-card:hover {
        transform: translateY(-2px);
      }

      .template-mini-header {
        opacity: 0.8;
      }

      .template-mini-content {
        opacity: 0.6;
      }
    `,
  ],
})
export class TemplateSelectorComponent implements OnInit {
  @Output() templateSelected = new EventEmitter<ResumeTemplate>();
  @Output() cancelled = new EventEmitter<void>();

  templates: ResumeTemplate[] = [];
  selectedTemplate: ResumeTemplate | null = null;

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.templates = this.templateService.getTemplates();
    // Select default template
    this.selectedTemplate = this.templateService.getDefaultTemplate();
  }

  selectTemplate(template: ResumeTemplate): void {
    this.selectedTemplate = template;
  }

  onConfirm(): void {
    if (this.selectedTemplate) {
      this.templateSelected.emit(this.selectedTemplate);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getPreviewStyles(template: ResumeTemplate): any {
    return {
      'font-family': template.styles.fontFamily,
      color: '#374151',
    };
  }

  getColorName(hexColor: string): string {
    const colorMap: { [key: string]: string } = {
      '#2563eb': 'Blue',
      '#7c3aed': 'Purple',
      '#374151': 'Gray',
      '#059669': 'Green',
    };
    return colorMap[hexColor] || 'Custom';
  }
}
