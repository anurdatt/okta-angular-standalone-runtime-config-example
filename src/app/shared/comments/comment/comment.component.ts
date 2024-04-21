import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NestedComment } from '../nested-comment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { Comment } from '../comment';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommentFormComponent,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Change detection strategy
})
export class CommentComponent {
  @Input('comment')
  comment: NestedComment;

  @Output('result') result: any = new EventEmitter<Comment>();

  replying: boolean = false;
  isCommentFormHidden: boolean = false;
  isChildCommentsHidden: boolean = true;

  onClickReply() {
    if (!this.replying) this.isCommentFormHidden = false;
    else this.isCommentFormHidden = !this.isCommentFormHidden;
    this.replying = true;

    console.log(
      `replying=${this.replying}. isCommentFormHidden=${this.isCommentFormHidden}`
    );
  }

  onClickShowHideReplies() {
    this.isChildCommentsHidden = !this.isChildCommentsHidden;
  }

  transmitComment(comment: Comment) {
    console.log(`Transmitting comment - ${comment}`);
    this.result.emit(comment);
  }

  transmitCommentStart(comment: Comment) {
    console.log(`Transmitting comment start - ${comment}`);
    this.replying = false;
    if (comment != null) this.result.emit(comment);
  }

  trackByFn(index: number, comment: NestedComment): string {
    return comment.comment.id; // Use a unique identifier for each comment
  }
}
