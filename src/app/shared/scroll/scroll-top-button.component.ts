import { Component, OnInit } from '@angular/core';
import { ScrollService } from './scroll.service';
import { Observable } from 'rxjs';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-scroll-top-button',
  template: ` <button (click)="scrollToTop()">Scroll to Top</button> `,
  imports: [CommonModule],
})
export class ScrollTopButtonComponent implements OnInit {
  hasScrolledToHeight$: Observable<boolean>;

  constructor(
    private scrollService: ScrollService,
    private vps: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.hasScrolledToHeight$ = this.scrollService.hasScrolledToHeight(200); // Change 200 to your desired scroll height
  }

  scrollToTop(): void {
    console.log('going to top');
    // console.log({ 'window Y': window });
    console.log({ pos: this.vps.getScrollPosition() });
    this.vps.scrollToPosition([0, 0]);
    // document.body.scrollTop = 0;
    // window.scrollTo({ top: 100, behavior: 'smooth' });
  }
}
