import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import { CoursesService } from '../courses/courses.service';
import { AuthService } from '../shared/okta/auth.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CoursesViewComponent } from '../courses/courses-view/courses-view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    CoursesViewComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [CoursesService],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated$: Observable<boolean>;

  headCols = '1';
  headHeight = '450px';
  // headColor = '#673ab7';

  handsetPortrait = false;

  coursesTitle = 'Top Courses';

  breakpointSubscription: Subscription;

  constructor(
    // public authStateService: OktaAuthStateService,
    // @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public authService: AuthService,
    private responsive: BreakpointObserver
  ) {
    this.isAuthenticated$ = authService.isAuthenticated$;
  }
  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.breakpointSubscription = this.responsive
      .observe(Breakpoints.HandsetPortrait)
      .subscribe((result) => {
        this.handsetPortrait = false;
        if (result.matches) {
          this.handsetPortrait = true;
        }
      });
  }

  // isAdmin(): boolean {
  //   if (Array.isArray(this.groups)) {
  //     return this.groups.includes(this.adminSearchString);
  //   } else {
  //     // Handle the case where it's a single value, not an array
  //     return this.groups === this.adminSearchString;
  //   }
  // }
}
