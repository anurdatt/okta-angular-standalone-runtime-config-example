import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './all-tags-view.component.html',
  styleUrl: './all-tags-view.component.scss',
})
export class AllTagsViewComponent {
  searchText: string;
  searchTopic(evt) {
    evt.preventDefault();
    console.log('Search topic..', this.searchText);
  }
}
