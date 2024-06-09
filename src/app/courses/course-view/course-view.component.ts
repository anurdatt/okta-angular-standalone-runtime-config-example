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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ScrollService } from '../../shared/scroll/scroll.service';
import { MatDialog } from '@angular/material/dialog';
import { UrlVideoDialogComponent } from './url-video-dialog/url-video-dialog.component';

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
    MatCardModule,
    MatIconModule,
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
  breakpointSubscription: Subscription;
  scrollSubscription: Subscription;
  handsetPortrait = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: CoursesService,
    private responsive: BreakpointObserver,
    private scrollService: ScrollService,
    private dialog: MatDialog
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

    this.breakpointSubscription = this.responsive
      .observe([
        // Breakpoints.TabletLandscape,
        Breakpoints.TabletPortrait,
        Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait,
      ])
      .subscribe((result) => {
        this.handsetPortrait = false;
        if (result.matches) {
          this.handsetPortrait = true;
        }
      });

    this.scrollSubscription = this.scrollService
      .getScrollPosition()
      .subscribe((p) => {
        const overlayDiv = document.querySelector(
          '.sidebar-purchase-container'
        );
        // console.log('From CourseView - scroll position = ' + p.toString());
        if (overlayDiv) {
          if (p > 370) {
            overlayDiv.classList.add('fixed');
          } else {
            overlayDiv.classList.remove('fixed');
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.lessonSubscription?.unsubscribe();
    this.breakpointSubscription?.unsubscribe();
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

    this.router.navigate([
      '../courses',
      this.course.courseUrl,
      'lessons',
      this.lessons[0].id,
    ]);
  }

  showPreview() {
    // alert('Play preview video in player');
    const dialogRef = this.dialog.open(UrlVideoDialogComponent, {
      // width: this.handsetPortrait ? '90%' : '50%',
      // height: 'fit-content',
      disableClose: true,
      data: { lessons: this.lessons.filter((l) => !l.paid) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
