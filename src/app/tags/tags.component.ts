import { Component } from '@angular/core';
import { Tag } from '../blogs/model/tag';
import { TagListComponent } from './tag-list/tag-list.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterLink, CommonModule, TagListComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent {
  tags: Tag[] = [
    {
      id: 'Technology-15551',
      name: 'Technology',
    },
    {
      id: 'Science-67698',
      name: 'Science',
    },
    {
      id: 'Software-76977',
      name: 'Software',
    },
    {
      id: 'Programming-15791',
      name: 'Programming',
    },
    {
      id: 'Arts-15443',
      name: 'Arts',
    },
    {
      id: 'Mythology-45234',
      name: 'Mythology',
    },
    {
      id: 'Life-23343',
      name: 'Life',
    },
  ];
}
