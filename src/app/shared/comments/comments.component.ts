import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription, of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommentsService } from './comments.service';
import { CommentComponent } from './comment/comment.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NestedComment } from './nested-comment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../okta/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    CommentComponent
  ],
  providers: [
    CommentsService
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input("sourceApp") sourceApp: string;
  @Input("sourceId") sourceId: string;

  @Input("isHidden") isHidden: boolean;

  @Output() commentsLoaded = new EventEmitter<number>();

  comments: NestedComment[];


  isLoadingResults = false;
  feedback: any = {};

  commentSubscription: Subscription;
  authSubscription: Subscription;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private authService: AuthService, 
    private commentsService: CommentsService, private _snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
    console.log("Comments initiated!");
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      async (authenticated) => {
        if (authenticated) {
          this.newComment.author = await this.authService.getUserFullname();
        }
      }
    );
    this.loadComments();
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
            this._snackbar.open('Error occured in loading!', 'Failure', {
              // panelClass: ['alert', 'alert-failure'],
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          } else {
            this.comments = nestedComments;

            this._snackbar.open('Load completed successfully!', 'Success', {
              // panelClass: ['alert', 'alert-success'],
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 1000,
            });

            this.commentsLoaded.emit(this.getTotalComments());
          }
        });
    } catch (err) {
      this.isLoadingResults = false;
      console.error({ err });
      this._snackbar.open('Error occured in loading!', 'Failure', {
        // panelClass: ['alert', 'alert-failure'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }


  getTotalComments() {
    return 50;
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

  ngOnDestroy(): void {
    this.commentSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
