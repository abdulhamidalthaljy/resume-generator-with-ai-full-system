import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Workshop } from '../../models/workshop.model'; // Adjust path if needed

@Component({
  selector: 'app-workshop-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './workshop-entry.component.html',
  styleUrls: ['./workshop-entry.component.css']
})
export class WorkshopEntryComponent implements OnInit {
  @Input() workshop!: Workshop;
  @Input() index!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() workshopChange = new EventEmitter<Workshop>();

  constructor() { }

  ngOnInit(): void { }

  onRemoveClick(): void {
    this.remove.emit(this.index);
  }

  onInputChange(): void {
    this.workshopChange.emit(this.workshop);
  }
}