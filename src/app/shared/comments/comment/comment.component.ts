import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { NestedComment } from '../nested-comment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { Comment } from '../comment';
import { MatMenuModule } from '@angular/material/menu';
import { CommonUtil } from '../../CommonUtil';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    CommentFormComponent,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Change detection strategy
})
export class CommentComponent implements OnInit {
  @Input('comment')
  comment: NestedComment;
  @Input('currentUser') currentUser: string | undefined;
  @Input('isAdmin') isAdmin: boolean | undefined;

  @Output('result') result: any = new EventEmitter<Comment>();

  @Output('deleteComment') deleteComment: any = new EventEmitter<Comment>();

  replying: boolean = false;
  editting: boolean = false;
  isCommentFormHidden: boolean = false;
  isChildCommentsHidden: boolean = true;

  commonUtil: CommonUtil = new CommonUtil();

  relativeDate: string;

  constructor() {
    // authService.isAuthenticated$.subscribe(async (isAuthed) => {
    //   if (isAuthed) this.currentUser = await authService.getUserFullname();
    //   authService.userGroups$.subscribe(
    //     (groups) => (this.isAdmin = authService.isAdmin(groups))
    //   );
    // });
  }
  ngOnInit(): void {
    this.relativeDate = this.commonUtil.formatRelativeDate(
      new Date(this.comment.comment.date)
    );
  }

  onClickReply() {
    if (!this.replying) this.isCommentFormHidden = false;
    else this.isCommentFormHidden = !this.isCommentFormHidden;
    this.replying = true;

    console.log(
      `replying=${this.replying}. isCommentFormHidden=${this.isCommentFormHidden}`
    );
  }

  isChangeAllowed(): boolean {
    // console.log('isChangeAllowed - ' + this.currentUser);
    return (
      this.currentUser != undefined &&
      (this.currentUser == this.comment.comment.author || this.isAdmin)
    );
  }
  onClickDelete() {
    console.log('Selecting delete comment: ', this.comment);
    this.deleteComment.emit(this.comment.comment);
  }
  onClickEdit() {
    this.editting = true;
  }

  onClickShowHideReplies() {
    this.isChildCommentsHidden = !this.isChildCommentsHidden;
  }

  transmitComment(comment: Comment) {
    console.log(`Transmitting comment - ${comment}`);
    this.result.emit(comment);
  }

  transmitDeleteComment(comment: Comment) {
    console.log(`Transmitting delete comment - ${comment}`);
    this.deleteComment.emit(comment);
  }

  transmitCommentStart(comment: Comment) {
    console.log(`Transmitting comment start - ${comment}`);
    if (this.replying) {
      this.replying = false;
    }
    if (this.editting) {
      this.editting = false;
    }

    if (comment != null) this.result.emit(comment);
  }

  trackByFn(index: number, comment: NestedComment): string {
    return comment.comment.id; // Use a unique identifier for each comment
  }
}
