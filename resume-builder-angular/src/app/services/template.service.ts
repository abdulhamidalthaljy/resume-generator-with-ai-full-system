import { Injectable } from '@angular/core';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string; // URL or path to preview image
  styles: {
    headerColor: string;
    accentColor: string;
    fontFamily: string;
    layout: 'single-column' | 'two-column' | 'sidebar';
  };
}

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private templates: ResumeTemplate[] = [
    {
      id: 'classic',
      name: 'Classic Professional',
      description:
        'Clean and professional design perfect for corporate positions',
      preview: '/assets/templates/classic-preview.png',
      styles: {
        headerColor: '#2563eb', // blue-600
        accentColor: '#1d4ed8', // blue-700
        fontFamily: 'Inter, sans-serif',
        layout: 'single-column',
      },
    },
    {
      id: 'modern',
      name: 'Modern Creative',
      description:
        'Contemporary design with creative elements for design roles',
      preview: '/assets/templates/modern-preview.png',
      styles: {
        headerColor: '#7c3aed', // purple-600
        accentColor: '#6d28d9', // purple-700
        fontFamily: 'Poppins, sans-serif',
        layout: 'two-column',
      },
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple and elegant design focusing on content',
      preview: '/assets/templates/minimal-preview.png',
      styles: {
        headerColor: '#374151', // gray-700
        accentColor: '#1f2937', // gray-800
        fontFamily: 'Source Sans Pro, sans-serif',
        layout: 'single-column',
      },
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated design for senior-level positions',
      preview: '/assets/templates/executive-preview.png',
      styles: {
        headerColor: '#059669', // emerald-600
        accentColor: '#047857', // emerald-700
        fontFamily: 'Merriweather, serif',
        layout: 'sidebar',
      },
    },
  ];

  constructor() {}

  getTemplates(): ResumeTemplate[] {
    return this.templates;
  }

  getTemplate(id: string): ResumeTemplate | undefined {
    return this.templates.find((template) => template.id === id);
  }

  getDefaultTemplate(): ResumeTemplate {
    return this.templates[0]; // Return classic as default
  }
}
