import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../model/post';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/okta/auth.service';
import { BlogsService } from '../blogs.service';
import { BlogUtil } from '../util/BlogUtil';
import { CommonUtil } from '../../shared/CommonUtil';
import { Subscription, catchError, of as observableOf } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { TagListComponent } from '../../tags/tag-list/tag-list.component';
import { Tag } from '../model/tag';
import { PostWithTags } from '../model/post-with-tags';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    // MatTooltipModule,
    MatIconModule,
    TagListComponent,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
  // encapsulation: ViewEncapsulation.None,
})
export class BlogListComponent implements OnInit, OnDestroy {
  blogUtil: BlogUtil = new BlogUtil();
  commonUtil: CommonUtil = new CommonUtil();

  @Input('postWithTagsList')
  postWithTagsList: PostWithTags[];

  // tags: Tag[] = [{ id: '221', name: 'Programming' }];
  deleteSubscription: Subscription;
  isDeletingResults = false;
  feedback: any = {};

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private router: Router,
    public authService: AuthService,
    private blogService: BlogsService,
    private _snackbar: MatSnackBar
  ) {}

  openPost(id: string) {
    this.router.navigate(['../../../blogs', 'blog-view', id]);
  }

  // @HostListener('scroll', ['$event'])
  // OnScroll($event: any) {
  //   console.log('Scroll event : ' + JSON.stringify($event));
  //   console.log('window scrol top = ' + window.scrollY);
  // }

  deletePost(id: string) {
    if (confirm('Are you sure?')) {
      console.log(`deleting post : ${id}`);
      this.isDeletingResults = true;
      this.deleteSubscription = this.blogService
        .deletePostById(id)
        .pipe(
          catchError((err) => {
            console.log('delete failed with error: ' + JSON.stringify(err));
            return observableOf({ err });
          })
        )
        .subscribe((p) => {
          // this.post = p;
          this.isDeletingResults = false;
          if (p != null && p['hasOwnProperty']('err')) {
            // this.feedback = {
            //   type: 'failure',
            //   message: 'Error occured in deleting!',
            // };
            this._snackbar.open('Error occured in deleting!', 'Failure', {
              // panelClass: ['alert', 'alert-failure'],
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          } else {
            // this.feedback = {
            //   type: 'success',
            //   message: 'Delete completed successfully!',
            // };
            this._snackbar.open('Delete completed successfully!', 'Success', {
              // panelClass: ['alert', 'alert-success'],
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              // duration: 1000,
            });

            setTimeout(() => {
              // this.feedback = {};
              this.router
                .navigate(['/'], { skipLocationChange: true })
                .then(() => this.router.navigate(['blogs']));
            }, 1000);
          }
        });
    }
  }

  likePost(id: string) {}

  bookmarkPost(id: string) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }
}
