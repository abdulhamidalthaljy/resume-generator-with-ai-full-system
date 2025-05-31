import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-input-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      *ngIf="isVisible"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Tell me about yourself
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Provide information about your professional background, and I'll
              help create your resume content.
            </p>
            <textarea
              [(ngModel)]="userInput"
              class="mt-4 w-full p-2 border rounded-md"
              rows="6"
              placeholder="Example: I am a software developer with 5 years of experience in web development. I have worked with Angular, Node.js, and React. I graduated from XYZ University with a degree in Computer Science..."
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end mt-4 space-x-3">
          <button
            (click)="onCancel()"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            (click)="onSubmit()"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            [disabled]="!userInput.trim()"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AIInputDialogComponent {
  @Output() submit = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  isVisible = true;
  userInput = '';

  onSubmit() {
    if (this.userInput.trim()) {
      this.submit.emit(this.userInput);
      this.isVisible = false;
    }
  }

  onCancel() {
    this.cancel.emit();
    this.isVisible = false;
  }
}
