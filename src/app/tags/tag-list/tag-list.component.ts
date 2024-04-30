import { Component, Input } from '@angular/core';
import { Tag } from '../../blogs/model/tag';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
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

  @Input('btnBorderBottomId')
  btnBorderBottomId: string;

  constructor(private router: Router) {}
  navigateTo(tagId: string) {
    // setTimeout(() => {
    console.log('Navigating to ' + tagId);
    if (!this.router.url.endsWith(tagId)) {
      this.router
        .navigate(['/home'], { skipLocationChange: true })
        .then(() => {
          setTimeout(() => {
          if (tagId == 'all-topics') this.router.navigate(['/all-topics']);
          else this.router.navigate(['/tag', tagId]);
          }, 10);
        });
    }
    // }, 1000);
  }
}
