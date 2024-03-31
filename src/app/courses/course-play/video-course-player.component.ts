// video-course-player.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Video } from '../model/video';

interface VideoUrl {
  title: string;
  url: string;
}

@Component({
  selector: 'app-video-course-player',
  templateUrl: './video-course-player.component.html',
  styleUrls: ['./video-course-player.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class VideoCoursePlayerComponent implements OnInit, AfterViewInit {
  @Input() courseTitle: string;
  @Input() playlist: Video[]; //string[];
  @Input() url: string;

  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;

  ctlList = ''; //'nodownload nofullscreen';
  playList: VideoUrl[] = [];
  currentIndex = 0;
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  get currentVideoUrl(): string {
    return this.playList[this.currentIndex].url;
  }

  playPause() {
    const video = this.videoPlayer.nativeElement;
    if (this.isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  previousVideo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playVideoAtIndex();
    }
  }

  nextVideo() {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.playVideoAtIndex();
    }
  }

  playVideoAtIndex() {
    const video = this.videoPlayer.nativeElement;
    video.currentTime = 0; // Reset video time
    video.src = this.currentVideoUrl;
    video.play();
    this.isPlaying = true;
  }

  selectVideo(index: number) {
    // const video = this.videoPlayer.nativeElement;
    // const videoUrl = this.playList[index].url;
    // video.src = videoUrl;
    // video.play();
    // // this.playPause(); // Auto play the selected video
    this.currentIndex = index;
    this.playVideoAtIndex();
  }

  seek(event: any) {
    const video = this.videoPlayer.nativeElement;
    video.currentTime = parseFloat(event.target.value);
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  ngOnInit() {
    // Initialize playlist (You can fetch this data from an API or a service)
    // this.playList = [
    //   {
    //     title: 'Video 1',
    //     url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4',
    //   },
    //   {
    //     title: 'Video 2',
    //     url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4',
    //   },
    //   {
    //     title: 'Video 3',
    //     url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_10mb.mp4',
    //   },
    // ];
    this.playList = //this.playList.concat(
      this.playlist.map((l) => {
        return { title: l.description, url: `${this.url}/${l.id}.mp4` };
      });
    //);
  }

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    video.addEventListener('timeupdate', () => {
      this.currentTime = video.currentTime;
      this.duration = video.duration;
    });
  }
}
