import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { CoursesService } from '../courses.service';
import {
  Observable,
  Subscription,
  catchError,
  map,
  of as observableOf,
} from 'rxjs';
import { Course } from '../model/course';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CustomUserClaim } from '@okta/okta-auth-js';
import { AuthService } from '../../shared/okta/auth.service';
import { RouterLink } from '@angular/router';
import { ScrollService } from '../../shared/scroll/scroll.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TagListComponent } from '../../tags/tag-list/tag-list.component';
import { TagsService } from '../../tags/tags.service';
import { Tag } from '../../tags/model/tag';

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
    MatCheckboxModule,
    FormsModule,
    CoursesCardListComponent,
    TagListComponent,
  ],
  templateUrl: './courses-view.component.html',
  styleUrl: './courses-view.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesViewComponent implements OnInit, OnDestroy {
  @Input('title')
  title: string;

  findFree: boolean = false;

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  isAuthenticated$: Observable<boolean>;
  userGroups$: Observable<CustomUserClaim | CustomUserClaim[]>;

  isLoadingResults = false;
  coursesSubscription: Subscription;
  fetchTagsSubscription: Subscription;

  fetchedTags: Tag[];

  constructor(
    public authService: AuthService,
    private coursesService: CoursesService,
    private scrollService: ScrollService,
    private tagsService: TagsService
  ) {
    this.isAuthenticated$ = authService.isAuthenticated$;
    this.userGroups$ = authService.userGroups$;
  }

  ngOnInit(): void {
    this.findAndMapCourses();
    this.fetchTopTags(7);
    this.scrollService.scrollToTop(0, 'auto');
  }

  findAndMapCourses() {
    this.coursesSubscription?.unsubscribe();
    this.isLoadingResults = true;
    const courses$: Observable<Course[]> = this.coursesService.findAll();

    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses
          .filter(
            (course) =>
              course.category === 'BEGINNER' &&
              (this.findFree ? course.price == 0 : course.price >= 0)
          )
          .flatMap((course) => [course, course, course, course])
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses
          .filter(
            (course) =>
              course.category === 'ADVANCED' &&
              (this.findFree ? course.price == 0 : course.price >= 0)
          )
          .flatMap((course) => [course, course, course, course])
      )
    );
    this.coursesSubscription = courses$.subscribe((courses) => {
      this.isLoadingResults = false;
    });
  }

  fetchTopTags(count: number) {
    this.isLoadingResults = true;

    this.fetchTagsSubscription = this.tagsService
      .findAll()
      .pipe(
        catchError((err) => {
          console.error(
            'FindAll tags failed with error : ' + JSON.stringify(err)
          );
          return observableOf(null);
        })
      )
      .subscribe((tags: Tag[]) => {
        this.isLoadingResults = false;
        if (tags == null) {
          console.error('Tags fetch failed..');

          // this._snackbar.open('Error occured in loading Tags!', 'Failure', {
          //   // panelClass: ['alert', 'alert-failure'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        } else {
          // this.allTags = tags;
          this.fetchedTags = tags.slice(0, count);

          console.log('Fetched tags = ', JSON.stringify(this.fetchedTags));
          // this._snackbar.open('Load tags completed successfully!', 'Success', {
          //   // panelClass: ['alert', 'alert-success'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          //   duration: 1000,
          // });
        }
      });
  }

  ngOnDestroy(): void {
    this.coursesSubscription?.unsubscribe();
    this.fetchTagsSubscription?.unsubscribe();
  }
}
