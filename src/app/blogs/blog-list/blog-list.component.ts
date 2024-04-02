import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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

// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }

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
  // tiles: Tile[] = [
  //   { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
  //   { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
  //   { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
  //   { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  // ];

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

  deleteSubscription: Subscription;
  isLoadingResults = false;
  feedback: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private blogService: BlogsService
  ) {}

  openPost(id: string) {
    this.router.navigate(['../../../blogs', 'blog-view', id]);
  }

  deletePost(id: string) {
    console.log(`deleting post : ${id}`);
    this.isLoadingResults = true;
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
        this.isLoadingResults = false;
        if (p != null && p['hasOwnProperty']('err')) {
          this.feedback = {
            type: 'failure',
            message: 'Error occured in deleting!',
          };
        } else {
          this.feedback = {
            type: 'success',
            message: 'Delete completed successfully!',
          };
        }
        setTimeout(() => {
          // this.feedback = {};
          this.router.navigate(['blogs']);
          this.router
            .navigate(['/'], { skipLocationChange: true })
            .then(() => this.router.navigate(['blogs']));
        }, 1000);
      });
  }

  ngOnInit(): void {
    this.posts = this.route.snapshot.data['posts'];
  }

  ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }
}
