import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../services/ai.service';
import { AIInputDialogComponent } from '../ai-input-dialog/ai-input-dialog.component';

@Component({
  selector: 'app-resume-form',
  standalone: true,
  imports: [CommonModule, FormsModule, AIInputDialogComponent],
  templateUrl: './resume-form.component.html',
  styleUrls: ['./resume-form.component.css'],
})
export class ResumeFormComponent implements OnInit {
  @Output() dataChange = new EventEmitter<any>();

  showAIDialog = false;
  currentField = '';
  currentValue = '';

  constructor(private aiService: AIService) {}

  ngOnInit() {
    // Initialize form data
  }

  async openAiDialog(field: string, currentValue: string = '') {
    this.currentField = field;
    this.currentValue = currentValue;
    this.showAIDialog = true;
  }

  async handleAIInput(userInput: string) {
    try {
      let result;
      switch (this.currentField) {
        case 'personalDetails':
          result = await this.aiService.generatePersonalDetails(userInput);
          this.personalDetails = { ...this.personalDetails, ...result };
          break;
        case 'informationSummary':
          result = await this.aiService.generateInformationSummary(userInput);
          this.informationSummary = result;
          break;
        case 'workExperience':
          result = await this.aiService.generateWorkExperience(userInput);
          this.workExperience = result;
          break;
        case 'education':
          result = await this.aiService.generateEducation(userInput);
          this.education = result;
          break;
        case 'languages':
          result = await this.aiService.generateLanguages(userInput);
          this.languages = result;
          break;
      }
      this.emitDataChanges();
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error generating content. Please try again.');
    } finally {
      this.showAIDialog = false;
    }
  }

  handleAICancel() {
    this.showAIDialog = false;
  }

  // ... rest of your existing component code ...
}
