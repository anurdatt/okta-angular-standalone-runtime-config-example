import { Component, Input } from '@angular/core';
import { Tag } from '../model/tag';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
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
  navigateTo(tag: Tag) {
    // setTimeout(() => {
    console.log('Navigating to ' + tag.tagUrl);
    // if (!this.router.url.endsWith(tagId)) {
    if (tag.tagUrl == 'all-topics') {
      // this.router.navigate(['/home'], { skipLocationChange: true }).then(() => {
      setTimeout(() => {
        this.router.navigate(['/tags']);
      }, 10);
      // });
    } else {
      const queryParams: NavigationExtras = {
        queryParams: {
          name: tag.name,
        },
      };

      setTimeout(() => {
        this.router.navigate(['/tags', tag.tagUrl], queryParams);
      }, 10);
    }
    // }
    // }, 1000);
  }
}
