import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-all-tags-view',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormField,
  ],
  templateUrl: './all-tags-view.component.html',
  styleUrl: './all-tags-view.component.scss',
})
export class AllTagsViewComponent {}
