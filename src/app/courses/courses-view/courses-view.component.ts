import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { CoursesService } from '../courses.service';
import { Observable, map } from 'rxjs';
import { Course } from '../model/course';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CustomUserClaim } from '@okta/okta-auth-js';
import { AuthService } from '../../shared/okta/auth.service';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../shared/scroll/scroll.service';

@Component({
  selector: 'app-courses-view',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
    CoursesCardListComponent,
  ],
  templateUrl: './courses-view.component.html',
  styleUrl: './courses-view.component.scss',
})
export class CoursesViewComponent implements OnInit {
  @Input('title')
  title: string;

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  isAuthenticated$: Observable<boolean>;
  userGroups$: Observable<CustomUserClaim | CustomUserClaim[]>;

  isLoadingResults = false;
  constructor(
    public authService: AuthService,
    private coursesService: CoursesService,
    private scrollService: ScrollService
  ) {
    this.isAuthenticated$ = authService.isAuthenticated$;
    this.userGroups$ = authService.userGroups$;
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    const courses$: Observable<Course[]> = this.coursesService.findAll();

    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === 'BEGINNER')
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === 'ADVANCED')
      )
    );
    courses$.subscribe((courses) => {
      this.isLoadingResults = false;
    });
    this.scrollService.scrollToTop(0, 'auto');
  }
}
