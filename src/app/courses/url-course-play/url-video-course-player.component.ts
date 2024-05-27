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
import {
  Subscription,
  BehaviorSubject,
  catchError,
  of as observableOf,
} from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../courses.service';
import { environment } from '../../../environments/environment';

interface VideoUrl {
  id: number;
  title: string;
  videoPathUrl: string;
  signedUrl: string;
}

@Component({
  selector: 'app-url-video-course-player',
  templateUrl: './url-video-course-player.component.html',
  styleUrls: ['./url-video-course-player.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [CoursesService],
})
export class UrlVideoCoursePlayerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() courseTitle: string;
  @Input() lessons: Lesson[]; //string[];
  @Input() courseUrl: string;

  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;
  @ViewChild('spinner') spinner: ElementRef<HTMLDivElement>;

  @Output('activeLesson') activeLesson: EventEmitter<Lesson> =
    new EventEmitter<Lesson>();

  ctlList = 'nodownload'; //'nofullscreen';
  playList: VideoUrl[] = [];
  currentIndex = 0;
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  $currentVideoSignedUrl: BehaviorSubject<string> = new BehaviorSubject('');
  signedUrlGetSubscription: Subscription = null;

  constructor(private coursesService: CoursesService) {}

  get currentVideoUrl(): string {
    return this.playList[this.currentIndex].videoPathUrl;
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
    if (this.currentIndex > 0 && !this.signedUrlGetSubscription) {
      this.currentIndex--;
      this.playVideoAtIndex();
    }
  }

  nextVideo() {
    if (
      this.currentIndex < this.playList.length - 1 &&
      !this.signedUrlGetSubscription
    ) {
      this.currentIndex++;
      this.playVideoAtIndex();
    }
  }

  playVideoAtIndex() {
    // if (!this.blobMediaGetSubscription) return;
    this.scrollTo(this.currentIndex);
    const video = this.videoPlayer.nativeElement;
    video.currentTime = 0; // Reset video time
    // video.src = this.currentVideoUrl;
    video.src = null;
    const vinfo: VideoUrl = this.currentVideoUrlInfo;
    const l: Lesson = this.lessons.find((l) => l.id == vinfo.id);
    this.activeLesson.emit(l);

    if (vinfo.signedUrl) {
      video.src = vinfo.signedUrl;
      this.$currentVideoSignedUrl.next(vinfo.signedUrl);
      // video.play();
      // this.isPlaying = true;
    } else {
      console.log('Trigerring VideoWaiting');
      this.triggerVideoWaitingEvent(); // Trigger the waiting event when starting to download
      this.signedUrlGetSubscription = this.coursesService
        .getSignedUrl(vinfo.videoPathUrl, environment.coursesBucketName)
        .pipe(
          catchError((err) => {
            console.error(
              'get signed url failed with error: ' + JSON.stringify(err)
            );
            return observableOf(null);
          })
        )
        .subscribe((url: string) => {
          console.log(url);
          if (url) {
            video.src = url;
            vinfo.signedUrl = url;
            this.$currentVideoSignedUrl.next(url);
            // console.log('Trigerring VideoCanPlay');
            // this.triggerVideoCanPlayEvent(); // Trigger the canplay event after download complete to stop spinner
            // video.play();
            // this.isPlaying = true;
          } else {
            alert('get signed url failed for url : ' + vinfo.videoPathUrl);
            console.log('Trigerring VideoCanPlay');
            this.triggerVideoCanPlayEvent(); // Trigger the canplay event after failed downoad to stop spinner.
          }

          this.signedUrlGetSubscription?.unsubscribe();
          this.signedUrlGetSubscription = null;
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
    if (!this.signedUrlGetSubscription) {
      this.currentIndex = index;
      this.playVideoAtIndex();
    }
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
      this.lessons.map((l) => {
        return {
          id: l.id,
          title: l.description,
          videoPathUrl: `${this.courseUrl}/${l.videoUrl}`,
          signedUrl: null,
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
    this.signedUrlGetSubscription?.unsubscribe();
  }
}
