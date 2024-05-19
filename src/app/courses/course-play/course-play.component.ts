import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VideoCoursePlayerComponent } from './video-course-player.component';
import { Video } from '../model/video';

@Component({
  selector: 'app-course-play',
  standalone: true,
  imports: [RouterModule, CommonModule, VideoCoursePlayerComponent],
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
  constructor(private route: ActivatedRoute) {}

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
}
