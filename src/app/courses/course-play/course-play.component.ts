import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VideoCoursePlayerComponent } from './video-course-player.component';
import { Video } from '../model/video';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommentsComponent } from '../../shared/comments/comments.component';

@Component({
  selector: 'app-course-play',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    VideoCoursePlayerComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommentsComponent,
  ],
  templateUrl: './course-play.component.html',
  styleUrl: './course-play.component.scss',
})
export class CoursePlayComponent implements OnInit, OnDestroy {
  courseUrl: string;
  courseAuthor: string;
  courseDescription: string;
  lessonVideos: Video[];
  activeLessonVideo: Video;

  paramSubscription: Subscription;

  sourceApp = 'COURSES';
  isHidden: boolean = false;
  loadComments: boolean = true;
  totalComments: number = 0;

  constructor(private route: ActivatedRoute, private elementRef: ElementRef) {}

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // console.log(this.route.params['vid']);
    this.paramSubscription = this.route.queryParams.subscribe((p) => {
      console.log(p['courseUrl']);
      this.courseUrl = p['courseUrl'];
      console.log(p['courseAuthor']);
      this.courseAuthor = p['courseAuthor'];
      console.log(p['lessonVideos']);
      if (p['lessonVideos'] != null) {
        this.lessonVideos = JSON.parse(p['lessonVideos']);
        this.activeLessonVideo = this.lessonVideos[0];
      }
      console.log(p['courseDescription']);
      this.courseDescription = p['courseDescription'];
    });
  }

  processActiveLesson(lessonVideo: Video) {
    this.activeLessonVideo = lessonVideo;
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
}
