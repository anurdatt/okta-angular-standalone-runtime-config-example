import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import videojs from 'video.js';
import { Lesson } from '../model/lesson';
import { environment } from '../../../environments/environment';
import { catchError, of as observableOf } from 'rxjs';
// import 'video.js/dist/video-js.css';

@Component({
  selector: 'app-url-video-player',
  standalone: true,
  imports: [],
  templateUrl: './url-video-player.component.html',
  styleUrl: './url-video-player.component.scss',
}) //, AfterViewInit
export class UrlVideoPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('target', { static: true }) target!: ElementRef<HTMLVideoElement>;
  @ViewChild('customContextMenu', { static: true })
  customContextMenu: ElementRef;
  @Input('lessonInput') lessonInput: Lesson;

  lesson: Lesson;
  videoUrl: string | undefined;
  fileName: string | undefined;

  player: any;
  isFullscreen: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router // private renderer: Renderer2, // private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // console.log(this.route.params['id']);

    if (this.lessonInput) {
      this.lesson = this.lessonInput;
      this.fileName = `${this.lesson.courseId}/${this.lesson.videoUrl}`;
      this.fetchVideoUrl();
    } else {
      this.route.data.subscribe((data) => {
        // this.ngOnDestroy();

        if (data == null || data['lesson'] == null) {
          console.error('No Data found!');
          setTimeout(() => {
            this.router.navigate(['/notfound'], { skipLocationChange: true });
          }, 100);
          return;
        }

        if (data['lesson']['id'] == null) return;

        this.lesson = data['lesson'];
        this.fileName = `${this.lesson.courseId}/${this.lesson.videoUrl}`;
        this.fetchVideoUrl();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lessonInput']) {
      this.lesson = this.lessonInput;
      this.fileName = `${this.lesson.courseId}/${this.lesson.videoUrl}`;
      this.fetchVideoUrl();
    }
  }

  fetchVideoUrl() {
    this.http
      .get(environment.coursesApiUrl + '/api/media/signed-url', {
        params: new HttpParams()
          .set('bucketName', 'lng-courses')
          .set('fileName', this.fileName),
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching video URL:', error);
          return observableOf(null);
        })
      )
      .subscribe((response) => {
        if (response != null) {
          this.videoUrl = response;
          console.log('Fetched Video URL:', this.videoUrl);
          this.setupVideoPlayer();
        }
      });
  }

  setupVideoPlayer() {
    console.log('player', this.player);
    if (this.player) {
      this.player.src({
        src: this.videoUrl,
        type: 'video/mp4',
      });

      // this.player.load();
      // this.player.play();
    } else {
      this.player = videojs(this.target.nativeElement, {
        fluid: true,
        poster: this.lesson.iconUrl,
        sources: [
          {
            src: this.videoUrl,
            type: 'video/mp4',
          },
        ],
        controls: true,
        // children: ['playbackRates', 'skipButtons'],
        playbackRates: [0.5, 1, 1.5, 2],
        settingsMenuButton: [
          // 'subtitlesButton',
          // 'captionsButton',
          'playbackRateMenuButton',
          // 'qualityMenuButton',
          'pictureInPictureToggle',
        ],

        // skipButtons: {
        //   forward: 10,
        //   backward: 10,
        // },
        controlBar: {
          remainingTimeDisplay: {
            displayNegative: false,
          },

          // playbackRates: [0.5, 1, 1.5, 2],
          // skipButtons: {
          //   forward: 10,
          //   backward: 10,
          // },
          children: [
            'playToggle',
            'volumePanel',
            // 'currentTimeDisplay',
            'remainingTimeDisplay',
            // 'timeDivider',
            // 'durationDisplay',
            'progressControl',
            'flexibleWidthSpacer',
            'settingsMenuButton',
            // 'skipForwardButton',
            // 'skipBackwardButton',
            'pictureInPictureToggle',
            'fullscreenToggle',
            'playbackRateMenuButton',
          ],
        },
      });
      this.player.on('error', (err) => {
        console.error('Video.js error:', err);
        const error = this.player.error();
        if (error.code === 2) {
          // MEDIA_ERR_NETWORK
          console.log('Network error: Attempting to regenerate signed URL');
          this.fetchVideoUrl();
        }
      });

      // this.renderer.listen('document', 'fullscreenchange', () =>
      //   this.onFullscreenChange()
      // );
      // this.renderer.listen('document', 'webkitfullscreenchange', () =>
      //   this.onFullscreenChange()
      // );
      // this.renderer.listen('document', 'mozfullscreenchange', () =>
      //   this.onFullscreenChange()
      // );
      // this.renderer.listen('document', 'msfullscreenchange', () =>
      //   this.onFullscreenChange()
      // );

      // this.player.on('contextmenu', (event) => this.onContextMenu(event));

      this.player.on('fullscreenchange', () => {
        this.isFullscreen = this.player.isFullscreen();
      });

      this.player.on('fullscreenchange', () => {
        if (this.player.isFullscreen()) {
          this.player
            .el()
            .addEventListener('contextmenu', this.handleFullscreenContextMenu);
        } else {
          this.player
            .el()
            .removeEventListener(
              'contextmenu',
              this.handleFullscreenContextMenu
            );
        }
      });

      this.player.el().addEventListener('contextmenu', (event: MouseEvent) => {
        event.preventDefault();
        this.showCustomContextMenu(event);
      });

      this.addCustomSkipButtons();
    }
  }

  // showCustomContextMenu(event: MouseEvent): void {
  //   const contextMenu = this.customContextMenu.nativeElement;
  //   const playerRect = this.player.el().getBoundingClientRect();
  //   // const offsetX = this.isFullscreen ? 0 : playerRect.left;
  //   // const offsetY = this.isFullscreen ? 0 : playerRect.top;

  //   contextMenu.style.display = 'block';
  //   // contextMenu.style.left = `${event.pageX}px`;
  //   // contextMenu.style.top = `${event.pageY}px`;
  //   // contextMenu.style.left = `${event.clientX - offsetX}px`;
  //   // contextMenu.style.top = `${event.clientY - offsetY}px`;
  //   const offsetX = event.pageX - playerRect.left;
  //   const offsetY = event.pageY - playerRect.top;

  //   contextMenu.style.left = `${offsetX}px`;
  //   contextMenu.style.top = `${offsetY}px`;

  //   document.addEventListener(
  //     'click',
  //     () => {
  //       contextMenu.style.display = 'none';
  //     },
  //     { once: true }
  //   );
  // }

  showCustomContextMenu(event: MouseEvent): void {
    const contextMenu = this.customContextMenu.nativeElement;

    if (this.isFullscreen) {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      if (fullscreenElement) {
        const videoRect = fullscreenElement.getBoundingClientRect();
        const offsetX = event.clientX - videoRect.left;
        const offsetY = event.clientY - videoRect.top;

        contextMenu.style.display = 'block';
        contextMenu.style.left = `${offsetX}px`;
        contextMenu.style.top = `${offsetY}px`;
      }
    } else {
      const videoRect = this.player.el().getBoundingClientRect();
      const offsetX = event.pageX - videoRect.left;
      const offsetY = event.pageY - videoRect.top;

      contextMenu.style.display = 'block';
      contextMenu.style.left = `${offsetX}px`;
      contextMenu.style.top = `${offsetY}px`;
    }

    document.addEventListener(
      'click',
      () => {
        contextMenu.style.display = 'none';
      },
      { once: true }
    );
  }

  handleFullscreenContextMenu = (event: MouseEvent): void => {
    event.preventDefault();

    const contextMenu = this.customContextMenu.nativeElement;
    const fullscreenElement =
      (document as any).fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement;
    const videoRect = fullscreenElement.getBoundingClientRect();

    const offsetX = event.clientX - videoRect.left;
    const offsetY = event.clientY - videoRect.top;

    contextMenu.style.display = 'block';
    contextMenu.style.left = `${offsetX}px`;
    contextMenu.style.top = `${offsetY}px`;

    document.addEventListener(
      'click',
      () => {
        contextMenu.style.display = 'none';
      },
      { once: true }
    );
  };

  // onFullscreenChange() {
  //   this.isFullscreen = !!document.fullscreenElement;
  // }

  // onContextMenu(event: MouseEvent) {
  //   event.preventDefault();
  //   const contextMenu =
  //     this.elementRef.nativeElement.querySelector('#contextMenu');
  //   const videoContainer = this.player.el().parentNode;

  //   let offsetX = this.isFullscreen
  //     ? 0
  //     : videoContainer.getBoundingClientRect().left;
  //   let offsetY = this.isFullscreen
  //     ? 0
  //     : videoContainer.getBoundingClientRect().top;

  //   if (this.isFullscreen) {
  //     offsetX = 0;
  //     offsetY = 0;
  //   } else {
  //     offsetX = videoContainer.getBoundingClientRect().left;
  //     offsetY = videoContainer.getBoundingClientRect().top;
  //   }

  //   contextMenu.style.display = 'block';
  //   contextMenu.style.left = `${event.clientX - offsetX}px`;
  //   contextMenu.style.top = `${event.clientY - offsetY}px`;
  // }

  handleOption(option: string): void {
    switch (option) {
      case 'play':
        this.player.play();
        break;
      case 'pause':
        this.player.pause();
        break;
      // Add more cases for other options as needed
    }
    this.customContextMenu.nativeElement.style.display = 'none';
  }

  // @HostListener('document:fullscreenchange', ['$event'])
  // onFullscreenChange(event: Event): void {
  //   this.isFullscreen = !!document.fullscreenElement;
  // }

  addCustomSkipButtons(): void {
    const Button = videojs.getComponent('Button');

    class SkipButton extends Button {
      constructor(player, options) {
        super(player, options);
        this.addClass('vjs-skip-button');
        // this.controlText(options.controlText);
        this.el().innerHTML = `<span style="cursor: pointer;" class="vjs-icon-placeholder ${options.iconClass}"></span>`;
        this.el().setAttribute('aria-label', options.controlText); // Set the control text as an attribute
        this.on('click', this.handleClick);
      }

      handleClick() {
        const currentTime = this.player().currentTime();
        const skipTime = this.options_.skipTime;
        this.player().currentTime(Math.max(0, currentTime + skipTime));
      }
    }

    videojs.registerComponent('SkipBackwardButton', SkipButton);
    videojs.registerComponent('SkipForwardButton', SkipButton);

    const skipBackwardButton = this.player.controlBar.addChild(
      'SkipBackwardButton',
      {
        controlText: 'Skip Backward',
        iconClass: 'vjs-icon-replay-10',
        skipTime: -5, // Skip backward 10 seconds
      }
    );

    const skipForwardButton = this.player.controlBar.addChild(
      'SkipForwardButton',
      {
        controlText: 'Skip Forward',
        iconClass: 'vjs-icon-forward-10',
        skipTime: 5, // Skip forward 10 seconds
      }
    );

    this.player.controlBar
      .el()
      .insertBefore(
        skipBackwardButton.el(),
        this.player.controlBar.el().firstChild
      );
    this.player.controlBar
      .el()
      .insertBefore(
        skipForwardButton.el(),
        this.player.controlBar.el().firstChild.nextSibling
      );
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
