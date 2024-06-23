import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../model/post';
import { Tag } from '../../tags/model/tag';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogListComponent } from '../blog-list/blog-list.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/okta/auth.service';
import { BlogsService } from '../blogs.service';
import { TagListComponent } from '../../tags/tag-list/tag-list.component';
import { TagsService } from '../../tags/tags.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { of as observableOf, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostWithTags } from '../model/post-with-tags';

@Component({
  selector: 'app-blogs-view',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    // MatGridListModule,
    // MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    BlogListComponent,
    TagListComponent,
  ],
  providers: [BlogsService],
  templateUrl: './blogs-view.component.html',
  styleUrl: './blogs-view.component.scss',
})
export class BlogsViewComponent implements OnInit, OnDestroy {
  postWithTagsList: PostWithTags[];
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

  isLoadingResults = true;
  fetchedTags: Tag[] = [];
  selectedTagId: string;
  fetchTagsSubscription: Subscription;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private tagsService: TagsService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.postWithTagsList = this.route.snapshot.data['postWithTagsList'];

    this.fetchTopTags(7);
  }

  fetchTopTags(count: number) {
    this.isLoadingResults = true;

    this.fetchTagsSubscription = this.tagsService
      .findAll()
      .pipe(
        catchError((err) => {
          console.error(
            'FindAll tags failed with error : ' + JSON.stringify(err)
          );
          return observableOf(null);
        })
      )
      .subscribe((tags: Tag[]) => {
        this.isLoadingResults = false;
        if (tags == null) {
          console.error('Tags fetch failed..');

          // this._snackbar.open('Error occured in loading Tags!', 'Failure', {
          //   // panelClass: ['alert', 'alert-failure'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        } else {
          // this.allTags = tags;
          this.fetchedTags = tags.slice(0, count);

          console.log('Fetched tags = ', JSON.stringify(this.fetchedTags));
          // this._snackbar.open('Load tags completed successfully!', 'Success', {
          //   // panelClass: ['alert', 'alert-success'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          //   duration: 1000,
          // });
        }
      });
  }

  ngOnDestroy() {
    this.fetchTagsSubscription?.unsubscribe();
  }
}
