import { Injectable } from '@angular/core';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  public scrollPosition$ = new BehaviorSubject<number>(0);

  // constructor() {
  //   fromEvent(window, 'scroll')
  //     .pipe(
  //       map(() => {
  //         console.log({ scroll: window.scrollY });
  //         return window.scrollY;
  //       }),
  //       distinctUntilChanged()
  //     )
  //     .subscribe((position) => {
  //       console.log({ position });
  //       return this.scrollPosition$.next(position);
  //     });

  //   // const scrollEvent$ = fromEvent(window, 'scroll');

  //   // scrollEvent$
  //   //   .pipe(
  //   //     map(() => {
  //   //       console.log({ scroll: window.scrollY });
  //   //       return window.scrollY;
  //   //     })
  //   //   )
  //   //   .subscribe({
  //   //     next: (scrollY) => {
  //   //       console.log('Next Scroll Y:', scrollY);
  //   //     },
  //   //     error: (error) => {
  //   //       console.error('Scroll Event Error:', error);
  //   //     },
  //   //     complete: () => {
  //   //       console.log('Scroll Event Completed');
  //   //     },
  //   //   });
  // }

  getScrollPosition(): Observable<number> {
    return this.scrollPosition$.asObservable();
  }

  hasScrolledToHeight(height: number): Observable<boolean> {
    return this.getScrollPosition().pipe(
      map((position) => {
        // console.log({ position });
        return position >= height;
      })
    );
  }

  scrollToTop(top: number = 0, behavior: ScrollBehavior = 'smooth'): void {
    console.log('going to top');
    // console.log({ 'window Y': window });
    // console.log({ pos: this.vps.getScrollPosition() });
    // this.vps.scrollToPosition([0, 0]);
    // document.body.scrollTop = 0;
    window.scrollTo({ top, behavior });
  }
}
