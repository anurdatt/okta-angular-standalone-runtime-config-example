import { Component, Input } from '@angular/core';
import { Tag } from '../../blogs/model/tag';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss',
})
export class TagListComponent {
  @Input('tags')
  tags: Tag[];

  @Input('btnHeight')
  btnHeight: string;

  @Input('btnBorderBottom')
  btnBorderBottom: boolean;
}
