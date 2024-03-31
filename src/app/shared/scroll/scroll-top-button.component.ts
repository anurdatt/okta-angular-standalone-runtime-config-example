import { Component, OnInit } from '@angular/core';
import { ScrollService } from './scroll.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-scroll-top-button',
  template: `
    <button *ngIf="hasScrolledToHeight$ | async" (click)="scrollToTop()">
      Scroll to Top
    </button>
  `,
  imports: [CommonModule],
})
export class ScrollTopButtonComponent implements OnInit {
  hasScrolledToHeight$: Observable<boolean>;

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {
    this.hasScrolledToHeight$ = this.scrollService.hasScrolledToHeight(200); // Change 200 to your desired scroll height
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
