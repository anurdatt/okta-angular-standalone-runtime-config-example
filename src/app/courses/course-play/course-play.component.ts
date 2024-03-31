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
  vid: string;
  name: string;
  lessonVideos: Video[];

  paramSubscription: Subscription;
  constructor(private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // console.log(this.route.params['vid']);
    this.paramSubscription = this.route.queryParams.subscribe((p) => {
      console.log(p['vid']);
      this.vid = p['vid'];
      console.log(p['lessons']);
      if (p['lessons'] != null) this.lessonVideos = JSON.parse(p['lessons']);
      console.log(p['name']);
      this.name = p['name'];
    });
  }
}
