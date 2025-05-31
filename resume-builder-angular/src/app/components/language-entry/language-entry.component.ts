import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
import { CommonModule } from '@angular/common'; // For *ngIf (if needed, not strictly for this template yet)
import { Language } from '../../models/language.model'; // Adjust path if models are elsewhere

@Component({
  selector: 'app-language-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './language-entry.component.html',
  styleUrls: ['./language-entry.component.css']
})
export class LanguageEntryComponent implements OnInit {
  // @Input() allows data to be passed from the parent (ResumeFormComponent)
  // We use '!' for definite assignment assertion if we are sure it will be provided by parent.
  // Or initialize with a default / make it optional.
  @Input() language!: Language;
  @Input() index!: number;

  // @Output() allows this component to send events to the parent
  @Output() remove = new EventEmitter<number>(); // Emits the index of the language to remove
  @Output() languageChange = new EventEmitter<Language>(); // To support two-way binding like [(language)]

  constructor() { }

  ngOnInit(): void {
    // If language is not initialized properly by parent, you might want to handle it here
    // For example, if (!this.language) this.language = { name: '', level: '' };
  }

  onRemoveClick(): void {
    this.remove.emit(this.index);
  }

  // When an input field changes, emit the updated language object
  onInputChange(): void {
    this.languageChange.emit(this.language);
  }
}