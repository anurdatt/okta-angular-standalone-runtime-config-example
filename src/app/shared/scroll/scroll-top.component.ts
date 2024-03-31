import { Component, HostListener, ElementRef, Inject } from '@angular/core';
import { WINDOW, WINDOW_PROVIDERS } from './window.service';
import { DOCUMENT } from '@angular/common';

@Component({
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css'],
  providers: [WINDOW_PROVIDERS],
})
export class ScrollTopComponent {
  isShow: boolean;
  topPosToStartShowing = 100;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {}

  // @HostListener('window:scroll')
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    console.log('Scrolling');
    const scrollPosition =
      this.window.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    this.window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
