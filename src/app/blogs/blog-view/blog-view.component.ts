import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toHTML, NgxEditorModule } from 'ngx-editor';
import { Post } from '../post';
import { MatCardModule } from '@angular/material/card';
import schema from '../blog-edit/ngxeditor-schema';
import { BlogUtil } from '../util/BlogUtil';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Comment } from '../comment';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/okta/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ScrollService } from '../../shared/scroll/scroll.service';
import { MatTooltip } from '@angular/material/tooltip';
// import { ScrollTopButtonComponent } from '../../shared/scroll/scroll-top-button.component';

@Component({
  selector: 'app-blog-view',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    NgxEditorModule,
    MatIconModule,
    MatTooltip,
    // ScrollTopButtonComponent,
  ],
  templateUrl: './blog-view.component.html',
  styleUrl: './blog-view.component.scss',
})
export class BlogViewComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoadingResults = false;
  feedback: any = {};

  post: Post;

  comments: Comment[];

  blogUtil: BlogUtil = new BlogUtil();
  safeContent$: BehaviorSubject<any> = new BehaviorSubject('');

  authSubscription: Subscription;
  scrollSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private authService: AuthService,
    public scrollService: ScrollService
  ) {}

  toHtml(jsonString: string) {
    const jsonDoc = JSON.parse(jsonString.replaceAll('\\\\n', '\\n'));
    return toHTML(jsonDoc, schema);
  }

  newComment = {
    author: 'Anonymous User',
    text: '',
  };

  submitComment() {
    // Implement comment submission logic here
    console.log('Submitting comment:', this.newComment);
    // Clear form fields after submission
    this.newComment = {
      author: '',
      text: '',
    };
  }

  async ngOnInit() {
    this.post = this.route.snapshot.data['post'];
    // this.comments = this.loadComments();
    this.comments = [
      { id: 1, author: 'AD', date: 'March 23, 2024', text: 'Dummy Comment 1' },
      { id: 2, author: 'AD', date: 'March 23, 2024', text: 'Dummy Comment 2' },
    ];
    this.safeContent$.next(
      this.sanitizer.bypassSecurityTrustHtml(this.toHtml(this.post.content))
    );
    // setInterval(() => {
    // console.log('timeout worked..');
    // document.addEventListener('DOMContentLoaded', (event) => {
    //   document.querySelectorAll('pre code').forEach((el) => {
    //     console.log('Element found..');
    //     return hljs.highlightElement(el as HTMLElement);
    //   });
    // });
    // }, 5000);

    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      async (authenticated) => {
        if (authenticated) {
          this.newComment.author = await this.authService.getUserFullname();
        }
      }
    );

    this.scrollSubscription = this.scrollService
      .getScrollPosition()
      .subscribe((p) => {
        console.log('From BlogView - scroll position = ' + p.toString());
      });
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    // console.log('timeout worked..');
    // document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((el) => {
      console.log('Element found..');
      return hljs.highlightElement(el as HTMLElement);
    });
    // });
    // }, 5000);
    this.scrollService.scrollToTop(0, 'auto');
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.scrollSubscription.unsubscribe();
  }
}
