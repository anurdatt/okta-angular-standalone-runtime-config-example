import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Course } from '../model/course';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/okta/auth.service';
import { Observable, Subscription } from 'rxjs';
import { CustomUserClaim } from '@okta/okta-auth-js';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TagListComponent } from '../../tags/tag-list/tag-list.component';
import { Tag } from '../../tags/model/tag';
import { MatLineModule } from '@angular/material/core';
import { CourseWithTags } from '../model/course-with-tags';

@Component({
  selector: 'app-courses-card-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatLineModule,
    TagListComponent,
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
  // encapsulation: ViewEncapsulation.None,
})
export class CoursesCardListComponent implements OnInit, OnDestroy {
  @Input()
  courses: CourseWithTags[];

  cols = 2;

  rowHeight = '550px';

  handsetPortrait = false;

  isAuthenticated$: Observable<boolean>;
  userGroups$: Observable<CustomUserClaim | CustomUserClaim[]>;

  breakpointSubscription: Subscription;

  testTag: Tag = {
    name: 'Test Tag',
  };

  constructor(
    public authService: AuthService,
    private responsive: BreakpointObserver
  ) {
    this.isAuthenticated$ = authService.isAuthenticated$;
    this.userGroups$ = authService.userGroups$;
  }

  ngOnInit(): void {
    this.breakpointSubscription = this.responsive
      .observe(Breakpoints.HandsetPortrait)
      .subscribe((result) => {
        this.handsetPortrait = false;
        // this.rowHeight = '500px';
        this.cols = 2;
        if (result.matches) {
          this.handsetPortrait = true;
          // this.rowHeight = '300px';
          this.cols = 1;
        }
      });
  }

  deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course ?')) {
      console.log('Going to delete course');
    }
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }
}
