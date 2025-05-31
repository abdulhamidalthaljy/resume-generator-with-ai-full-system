import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Education } from '../../models/education.model'; // Adjust path if needed

@Component({
  selector: 'app-education-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './education-entry.component.html',
  styleUrls: ['./education-entry.component.css']
})
export class EducationEntryComponent implements OnInit {
  @Input() educationItem!: Education; // Using educationItem as planned
  @Input() index!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() educationItemChange = new EventEmitter<Education>(); // Matches input name + "Change"

  constructor() { }

  ngOnInit(): void { }

  onRemoveClick(): void {
    this.remove.emit(this.index);
  }

  onInputChange(): void {
    this.educationItemChange.emit(this.educationItem);
  }
}