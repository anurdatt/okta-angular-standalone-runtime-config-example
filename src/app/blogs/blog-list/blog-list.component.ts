import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../post';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/okta/auth.service';
import { BlogsService } from '../blogs.service';
import { BlogUtil } from '../util/BlogUtil';
import { Subscription, catchError, of as observableOf } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Tag } from '../Tag';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
  providers: [BlogsService],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements OnInit, OnDestroy {
  blogUtil: BlogUtil = new BlogUtil();

  posts: Post[];
  //  = [
  //   {
  //     id: 1,
  //     title: 'First Post',
  //     author: 'Anuran Datta',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //     avatar_image_url:
  //       'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-material-course-1.jpg',
  //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //     date: 'March 1, 2024',
  //   },
  //   {
  //     id: 2,
  //     title: 'Second Post',
  //     author: 'Anuran Datta',
  //     description:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     avatar_image_url:
  //       'https://s3-us-west-1.amazonaws.com/angular-university/course-images/security-cover-small-v2.png',
  //     content:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     date: 'March 5, 2024',
  //   },
  //   {
  //     id: 3,
  //     title: 'Third Post',
  //     author: 'Anuran Datta',
  //     description:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     avatar_image_url: '',
  //     content:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     date: 'March 21, 2024',
  //   },
  //   // Add more posts as needed
  // ];

  tags: Tag[] = [
    {
      id: 'Technology-15551',
      name: 'Technology',
    },
    {
      id: 'Science-67698',
      name: 'Science',
    },
    {
      id: 'Software-76977',
      name: 'Software',
    },
    {
      id: 'Programming-15791',
      name: 'Programming',
    },
    {
      id: 'Arts-15443',
      name: 'Arts',
    },
    {
      id: 'Mythology-45234',
      name: 'Mythology',
    },
    {
      id: 'Life-23343',
      name: 'Life',
    },
  ];

  deleteSubscription: Subscription;
  isDeletingResults = false;
  feedback: any = {};

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private blogService: BlogsService,
    private _snackbar: MatSnackBar
  ) {}

  openPost(id: string) {
    this.router.navigate(['../../../blogs', 'blog-view', id]);
  }

  @HostListener('window:scroll', ['$event'])
  OnScroll($event: any) {
    console.log('Scroll event : ' + JSON.stringify($event));
    console.log('window scrol top = ' + window.scrollY);
  }

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

  ngOnInit(): void {
    this.posts = this.route.snapshot.data['posts'];
  }

  ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }
}
