import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkExperience } from '../../models/work-experience.model'; // Adjust path if needed

@Component({
  selector: 'app-work-experience-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './work-experience-entry.component.html',
  styleUrls: ['./work-experience-entry.component.css']
})
export class WorkExperienceEntryComponent implements OnInit {
  @Input() experience!: WorkExperience; // Renamed from workExperience to avoid conflict
  @Input() index!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() experienceChange = new EventEmitter<WorkExperience>(); // Output for changes

  constructor() { }

  ngOnInit(): void { }

  onRemoveClick(): void {
    this.remove.emit(this.index);
  }

  onInputChange(): void {
    this.experienceChange.emit(this.experience);
  }
}