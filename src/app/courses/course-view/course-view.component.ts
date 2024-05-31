import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  Router,
  RouterLink,
} from '@angular/router';
import { CoursesService } from '../courses.service';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { tap, catchError, throwError, finalize, Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './course-view.component.html',
  styleUrl: './course-view.component.scss',
})
export class CourseViewComponent implements OnInit, OnDestroy {
  course: Course;
  lessons: Lesson[] = [];
  loading: boolean = false;

  displayedColumns = ['seqNo', 'description', 'duration'];

  expandedLesson: Lesson = null;

  lessonSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: CoursesService
  ) {}

  ngOnInit(): void {
    if (
      this.route.snapshot.data['courses'] == null ||
      this.route.snapshot.data['courses'].length == 0
    ) {
      console.error('No Data found!');
      setTimeout(() => {
        this.router.navigate(['/notfound'], { skipLocationChange: true });
      }, 100);
      return;
    }
    this.course = this.route.snapshot.data['courses'][0];
    this.loadLessonsPage();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  ngOnDestroy(): void {
    this.lessonSubscription?.unsubscribe();
  }

  loadLessonsPage() {
    this.loading = true;

    this.lessonSubscription = this.service // .findlessons(this.course.id)
      .findlessonsByUrl(this.course.courseUrl)
      .pipe(
        tap((lessons) => (this.lessons = lessons)),
        catchError((err) => {
          console.log('Error loading lessons', err);
          alert('Error loading lessons.');
          return throwError(err);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  onToggleLesson(lesson: Lesson) {
    if (lesson == this.expandedLesson) {
      this.expandedLesson = null;
    } else {
      this.expandedLesson = lesson;
    }
  }

  navigateWithQueryParams() {
    // const queryParams: NavigationExtras = {
    //   queryParams: {
    //     courseUrl: `${environment.mediaApiUrl}?${this.course.courseUrl}`,
    //     courseAuthor: this.course.author,
    //     lessonVideos: JSON.stringify(
    //       this.lessons.map((l) => {
    //         console.log(JSON.stringify(l) + '\n');
    //         return {
    //           id: l.id,
    //           description: l.description,
    //           fileSize: l.fileSize,
    //         };
    //       })
    //     ),
    //     courseDescription: this.course.description,
    //   },
    // };

    this.router.navigate(['../courses', this.course.courseUrl, 'lessons']);
  }
}
