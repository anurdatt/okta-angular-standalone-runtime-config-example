// video-course-player.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Video } from '../model/video';
import { BlobMediaService } from '../blob-media.service';
import {
  Subscription,
  BehaviorSubject,
  catchError,
  of as observableOf,
} from 'rxjs';

interface VideoUrl {
  id: number;
  title: string;
  videoUrl: string;
  fileSize: number;
  blobUrl: string;
}

@Component({
  selector: 'app-video-course-player',
  templateUrl: './video-course-player.component.html',
  styleUrls: ['./video-course-player.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [BlobMediaService],
})
export class VideoCoursePlayerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() courseTitle: string;
  @Input() lessonVideos: Video[]; //string[];
  @Input() courseUrl: string;

  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;
  @ViewChild('spinner') spinner: ElementRef<HTMLDivElement>;

  @Output('activeLessonVideo') activeLessonVideo: EventEmitter<Video> =
    new EventEmitter<Video>();

  ctlList = 'nodownload'; //'nofullscreen';
  playList: VideoUrl[] = [];
  currentIndex = 0;
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  $currentVideoBlobUrl: BehaviorSubject<string> = new BehaviorSubject('');
  blobMediaGetSubscription: Subscription = null;

  constructor(private blobMediaService: BlobMediaService) {}

  get currentVideoUrl(): string {
    return this.playList[this.currentIndex].videoUrl;
  }
  get currentVideoUrlInfo(): VideoUrl {
    return this.playList[this.currentIndex];
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
    if (this.currentIndex < this.playList.length - 1) {
      this.currentIndex++;
      this.playVideoAtIndex();
    }
  }

  playVideoAtIndex() {
    this.blobMediaGetSubscription?.unsubscribe();
    this.scrollTo(this.currentIndex);
    const video = this.videoPlayer.nativeElement;
    video.currentTime = 0; // Reset video time
    // video.src = this.currentVideoUrl;
    video.src = null;
    const vinfo: VideoUrl = this.currentVideoUrlInfo;
    const lv: Video = this.lessonVideos.find((lv) => lv.id == vinfo.id);
    this.activeLessonVideo.emit(lv);

    if (vinfo.blobUrl) {
      video.src = vinfo.blobUrl;
      this.$currentVideoBlobUrl.next(vinfo.blobUrl);
      // video.play();
      // this.isPlaying = true;
    } else {
      console.log('Trigerring VideoWaiting');
      this.triggerVideoWaitingEvent(); // Trigger the waiting event when starting to download
      this.blobMediaGetSubscription = this.blobMediaService
        .getBlobUrl(vinfo.videoUrl, vinfo.fileSize)
        .pipe(
          catchError((err) => {
            console.error(
              'get blob url failed with error: ' + JSON.stringify(err)
            );
            return observableOf(null);
          })
        )
        .subscribe((url: string) => {
          if (url) {
            video.src = url;
            vinfo.blobUrl = url;
            this.$currentVideoBlobUrl.next(url);
            // console.log('Trigerring VideoCanPlay');
            // this.triggerVideoCanPlayEvent(); // Trigger the canplay event after download complete to stop spinner
            // video.play();
            // this.isPlaying = true;
          } else {
            alert('get blob url failed for url : ' + vinfo.videoUrl);
            console.log('Trigerring VideoCanPlay');
            this.triggerVideoCanPlayEvent(); // Trigger the canplay event after failed downoad to stop spinner.
          }
        });
    }
    // video.play();
    // this.isPlaying = true;
  }

  private setupVideoEvents() {
    const video = this.videoPlayer.nativeElement;
    video.addEventListener('timeupdate', () => {
      this.currentTime = video.currentTime;
      this.duration = video.duration;
    });
    video.addEventListener('waiting', this.onVideoWaiting.bind(this));
    video.addEventListener('playing', this.onVideoPlaying.bind(this));
    video.addEventListener('canplay', this.onVideoCanPlay.bind(this));
  }

  private onVideoWaiting() {
    console.log('Video is buffering...');
    this.spinner.nativeElement.style.display = 'block';
  }

  private onVideoPlaying() {
    console.log('Video is playing.');
    this.spinner.nativeElement.style.display = 'none';
  }

  private onVideoCanPlay() {
    console.log('Video can play.');
    this.spinner.nativeElement.style.display = 'none';
  }

  private triggerVideoWaitingEvent() {
    const event = new Event('waiting');
    this.videoPlayer.nativeElement.dispatchEvent(event);
  }

  private triggerVideoCanPlayEvent() {
    const event = new Event('canplay');
    this.videoPlayer.nativeElement.dispatchEvent(event);
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

  scrollTo(index: number): void {
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

    this.playList = //this.playList.concat(
      this.lessonVideos.map((lv) => {
        return {
          id: lv.id,
          title: lv.description,
          videoUrl: `${this.courseUrl}/${lv.id}.mp4`,
          fileSize: lv.fileSize,
          blobUrl: null,
        };
      });
    //);

    // this.playVideoAtIndex();
  }

  ngAfterViewInit() {
    this.setupVideoEvents();

    console.log('curent index ', this.currentIndex);
    this.playVideoAtIndex();
  }

  ngOnDestroy() {
    this.blobMediaGetSubscription?.unsubscribe();
  }
}
