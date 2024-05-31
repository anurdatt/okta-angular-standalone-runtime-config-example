import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, tap, catchError, throwError, finalize } from 'rxjs';
import { UrlVideoCoursePlayerComponent } from './url-video-course-player.component';
import { Video } from '../model/video';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommentsComponent } from '../../shared/comments/comments.component';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../courses.service';
import { environment } from '../../../environments/environment';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-url-course-play',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    UrlVideoCoursePlayerComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
    CommentsComponent,
  ],
  templateUrl: './url-course-play.component.html',
  styleUrl: './url-course-play.component.scss',
})
export class UrlCoursePlayComponent implements OnInit, OnDestroy {
  courseUrl: string;
  // courseAuthor: string;
  // courseDescription: string;
  // lessonVideos: Video[];
  // activeLesson: Lesson;

  // paramSubscription: Subscription;

  course: Course;
  lessons: Lesson[] = [];
  loading: boolean = false;
  lessonsSubscription: Subscription;

  sourceApp = 'COURSES';
  isHidden: boolean = false;
  loadComments: boolean = true;
  totalComments: number = 0;

  currentIndex: number = 0;
  lessonId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CoursesService,
    private elementRef: ElementRef
  ) {}

  ngOnDestroy(): void {
    this.lessonsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    // console.log(this.route.params['vid']);
    // this.paramSubscription = this.route.queryParams.subscribe((p) => {
    //   console.log(p['courseUrl']);
    //   this.courseUrl = p['courseUrl'];
    //   console.log(p['courseAuthor']);
    //   this.courseAuthor = p['courseAuthor'];
    //   console.log(p['lessonVideos']);
    //   if (p['lessonVideos'] != null) {
    //     this.lessonVideos = JSON.parse(p['lessonVideos']);
    //     this.activeLessonVideo = this.lessonVideos[0];
    //   }
    //   console.log(p['courseDescription']);
    //   this.courseDescription = p['courseDescription'];
    // });

    // this.route.firstChild.params.subscribe((params) => {
    //   if (params['id']) this.lessonId = params['id'];
    // });
    if (
      this.route.firstChild &&
      this.route.firstChild.snapshot.paramMap.get('id')
    ) {
      try {
        this.lessonId = parseInt(
          this.route.firstChild.snapshot.paramMap.get('id')
        );
      } catch (e) {
        console.error(e);
      }
    }

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
    this.courseUrl = `${this.course.baseUrl}`;
    // this.loadLessonsPage();
    this.lessons = this.route.snapshot.data['lessons'];
    if (!this.lessonId) this.selectVideo(0);
    else this.selectVideo(this.lessons.findIndex((l) => l.id == this.lessonId));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  loadLessonsPage() {
    this.loading = true;

    this.lessonsSubscription = this.service // .findlessons(this.course.id)
      .findlessonsByUrl(this.course.courseUrl)
      .pipe(
        tap((lessons) => {
          this.lessons = lessons;
          if (!this.lessonId) this.selectVideo(0);
          else
            this.selectVideo(
              this.lessons.findIndex((l) => l.id == this.lessonId)
            );
        }),
        catchError((err) => {
          console.log('Error loading lessons', err);
          alert('Error loading lessons.');
          return throwError(err);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  processActiveLesson(lesson: Lesson) {
    // this.activeLesson = lesson;
  }

  commentsLoadedCB(tc: number, sectionId: string) {
    this.totalComments = tc;
    this.isHidden = false;
    // this.scrollTo(sectionId);
  }
  scrollTo(sectionId: string): void {
    this.loadComments = true;
    this.isHidden = false;
    setTimeout(() => {
      const section = this.elementRef.nativeElement.querySelector(
        `#${sectionId}`
      );
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  selectVideo(index: number) {
    // const video = this.videoPlayer.nativeElement;
    // const videoUrl = this.playList[index].url;
    // video.src = videoUrl;
    // video.play();
    // // this.playPause(); // Auto play the selected video
    console.log('In selectVideo', index);
    this.currentIndex = index;
    this.navigateTo(index);
  }

  previousVideo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.navigateTo(this.currentIndex);
    }
  }

  nextVideo() {
    if (this.currentIndex < this.lessons.length - 1) {
      this.currentIndex++;
      this.navigateTo(this.currentIndex);
    }
  }

  navigateTo(index: number) {
    this.scrollPlaylistTo(index);
    this.router.navigate([
      '../courses',
      this.course.courseUrl,
      'lessons',
      this.lessons[index].id,
    ]);
  }

  scrollPlaylistTo(index: number): void {
    console.log('In scrolTo - index = ' + index);
    setTimeout(() => {
      const el = document.getElementById('playListScroll');
      const section = el.querySelector(`#v${index}`);
      console.log('section = ' + section);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 10);
  }
}
