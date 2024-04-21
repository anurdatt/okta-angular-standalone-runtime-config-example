import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toHTML, NgxEditorModule } from 'ngx-editor';
import { MatCardModule } from '@angular/material/card';
import schema from '../blog-edit/ngxeditor-schema';
import { BlogUtil } from '../util/BlogUtil';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/okta/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ScrollService } from '../../shared/scroll/scroll.service';
import { MatTooltip } from '@angular/material/tooltip';
import { PostWithTags } from '../model/post-with-tags';
import { TagListComponent } from '../../tags/tag-list/tag-list.component';
import { CommentsComponent } from '../../shared/comments/comments.component';
// import { ScrollTopButtonComponent } from '../../shared/scroll/scroll-top-button.component';

@Component({
  selector: 'app-blog-view',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    NgxEditorModule,
    MatIconModule,
    MatTooltip,
    // ScrollTopButtonComponent,
    TagListComponent,
    CommentsComponent,
  ],
  templateUrl: './blog-view.component.html',
  styleUrl: './blog-view.component.scss',
})
export class BlogViewComponent implements OnInit, OnDestroy, AfterViewInit {
  postWithTags: PostWithTags;

  blogUtil: BlogUtil = new BlogUtil();
  safeContent$: BehaviorSubject<any> = new BehaviorSubject('');

  scrollSubscription: Subscription;

  sourceApp = 'BLOG';
  isHidden: boolean = true;
  loadComments: boolean = false;
  totalComments: number = 0;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private authService: AuthService,
    public scrollService: ScrollService,
    private elementRef: ElementRef
  ) {}

  toHtml(jsonString: string) {
    const jsonDoc = JSON.parse(jsonString.replaceAll('\\\\n', '\\n'));
    return toHTML(jsonDoc, schema);
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

  async ngOnInit() {
    this.postWithTags = this.route.snapshot.data['postWithTags'];
    // this.comments = this.loadComments();
    // this.comments = [
    //   { id: 1, author: 'AD', date: 'March 23, 2024', text: 'Dummy Comment 1' },
    //   { id: 2, author: 'AD', date: 'March 23, 2024', text: 'Dummy Comment 2' },
    // ];
    this.safeContent$.next(
      this.sanitizer.bypassSecurityTrustHtml(
        this.toHtml(this.postWithTags.post.content)
      )
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

    this.scrollSubscription = this.scrollService
      .getScrollPosition()
      .subscribe((p) => {
        // console.log('From BlogView - scroll position = ' + p.toString());
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
    this.scrollSubscription?.unsubscribe();
  }
}
