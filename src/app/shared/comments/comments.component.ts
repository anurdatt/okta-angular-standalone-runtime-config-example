import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Subscription, of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommentsService } from './comments.service';
import { CommentComponent } from './comment/comment.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NestedComment } from './nested-comment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../okta/auth.service';
import { MatCardModule } from '@angular/material/card';
import { Comment } from './comment';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    CommentComponent,
    CommentFormComponent,
  ],
  providers: [CommentsService],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input('sourceApp') sourceApp: string;
  @Input('sourceId') sourceId: string | number;

  // @Input('isHidden') isHidden: boolean;

  @Output() commentsLoaded = new EventEmitter<number>();

  comments: NestedComment[];

  isLoadingResults = false;
  isSavingResults = false;
  isDeletingResults = false;
  feedback: any = {};

  commentSubscription: Subscription;
  saveCommentSubscription: Subscription;
  deleteCommentSubscription: Subscription;
  authSubscription: Subscription;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public authService: AuthService,
    private commentsService: CommentsService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('Comments initiated!');
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      async (authenticated) => {
        if (authenticated) {
          this.newComment.author = await this.authService.getUserFullname();
          this.newComment.profile_url =
            await this.authService.getUserProfileUrl();
        }
      }
    );

    this.loadComments();
  }

  async login() {
    await this.authService.signIn();
  }

  loadComments() {
    this.isLoadingResults = true;
    try {
      this.commentSubscription = this.commentsService
        .findAllNested(this.sourceApp, this.sourceId)
        .pipe(
          catchError((err) => {
            console.error(
              'findAllNestedComments failed with error : ' + JSON.stringify(err)
            );
            return observableOf(null);
          })
        )
        .subscribe((nestedComments: NestedComment[]) => {
          this.isLoadingResults = false;

          if (nestedComments == null) {
            //TODO: Uncomment below temp comments
            // this._snackbar.open(
            //   'Error occured in loading comments!',
            //   'Failure',
            //   {
            //     // panelClass: ['alert', 'alert-failure'],
            //     horizontalPosition: this.horizontalPosition,
            //     verticalPosition: this.verticalPosition,
            //   }
            // );
          } else {
            this.comments = nestedComments;

            this._snackbar.open(
              'Comments Load completed successfully!',
              'Success',
              {
                // panelClass: ['alert', 'alert-success'],
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 1000,
              }
            );

            this.commentsLoaded.emit(this.getTotalComments(this.comments));
          }
        });
    } catch (err) {
      this.isLoadingResults = false;
      console.error({ err });
      //TODO: Uncomment below temp comments
      // this._snackbar.open('Error occured in loading comments!', 'Failure', {
      //   // panelClass: ['alert', 'alert-failure'],
      //   horizontalPosition: this.horizontalPosition,
      //   verticalPosition: this.verticalPosition,
      // });
    }
  }

  getTotalComments(comments: NestedComment[]): number {
    // let temp: NestedComment[] = this.comments;
    let count = comments.length;
    for (let i = 0; i < comments.length; i++) {
      count += this.getTotalComments(comments[i].comments);
    }
    return count;
  }

  deleteComment(comment: Comment) {
    console.log('Received delete comment = ', comment);

    if (comment == null) return;

    console.log(`deleting comment : ${JSON.stringify(comment)}`);
    this.isDeletingResults = true;
    this.deleteCommentSubscription = this.commentsService
      .deleteCommentById(this.sourceApp, comment.id)
      .pipe(
        catchError((err) => {
          console.log('Delete failed with error: ' + JSON.stringify(err));
          return observableOf({ err });
        })
      )
      .subscribe((c) => {
        this.isDeletingResults = false;
        if (c != null && c['hasOwnProperty']('err')) {
          // this.feedback = {
          //   type: 'failure',
          //   message: 'Error occured in saving!',
          // };
          this._snackbar.open(
            'Error occured in deleting comments!',
            'Failure',
            {
              // panelClass: ['alert', 'alert-failure'],
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            }
          );
        } else {
          // this.feedback = {
          //   type: 'success',
          //   message: 'Save completed successfully!',
          // };
          this._snackbar.open(
            'Comment Delete completed successfully!',
            'Success',
            {
              // panelClass: ['alert', 'alert-success'],
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 1000,
            }
          );
          setTimeout(() => {
            this.feedback = {};
            this.loadComments();
          }, 1000);
        }
      });
  }

  addComment(comment: Comment) {
    console.log('Received comment = ', comment);

    if (comment == null) return;

    comment.author = this.newComment.author;
    comment.date = new Date().toISOString().split('T')[0]; // new Date().toLocaleDateString;
    comment.sourceId = this.sourceId;
    comment.sourceApp = this.sourceApp;
    // profile_url: null,

    console.log(`saving comment : ${JSON.stringify(comment)}`);
    this.isSavingResults = true;
    this.saveCommentSubscription = this.commentsService
      .save(comment)
      .pipe(
        catchError((err) => {
          console.log('Save failed with error: ' + JSON.stringify(err));
          return observableOf(null);
        })
      )
      .subscribe((c) => {
        this.isSavingResults = false;
        if (c == null) {
          // this.feedback = {
          //   type: 'failure',
          //   message: 'Error occured in saving!',
          // };
          this._snackbar.open('Error occured in saving comment!', 'Failure', {
            // panelClass: ['alert', 'alert-failure'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          console.log('saved comment = ', { c });
          // this.feedback = {
          //   type: 'success',
          //   message: 'Save completed successfully!',
          // };
          this._snackbar.open(
            'Comment Save completed successfully!',
            'Success',
            {
              // panelClass: ['alert', 'alert-success'],
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 1000,
            }
          );
          setTimeout(() => {
            this.feedback = {};
            this.loadComments();
          }, 1000);
        }
      });
  }

  trackByFn(index: number, comment: NestedComment): string {
    return comment.comment.id; // Use a unique identifier for each comment
  }

  newComment = {
    author: 'Anonymous User',
    profile_url: null,
  };

  getCurrentUser() {
    // console.log('getCurrentUser - ' + this.newComment.author);
    return this.newComment.author == 'Anonymous User'
      ? undefined
      : this.newComment.author;
  }

  ngOnDestroy(): void {
    this.commentSubscription?.unsubscribe();
    this.saveCommentSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
