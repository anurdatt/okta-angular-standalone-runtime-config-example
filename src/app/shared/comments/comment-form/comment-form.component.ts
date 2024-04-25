import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Comment } from '../comment';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
})
export class CommentFormComponent {
  @Input('parentId') parentId: string | undefined;
  @Input('placeHolderText') placeHolderText: string | undefined;

  @Output() result: EventEmitter<Comment> = new EventEmitter<Comment>();

  @Input('comment')
  comment: Comment | undefined;

  commentText: string | undefined;
  ngOnInit() {
    if (this.comment == undefined) this.comment = new Comment();
    if (this.parentId != undefined) this.comment.parentId = this.parentId;
    this.commentText = this.comment.text;
  }

  submitComment(cf) {
    // Implement comment submission logic here

    Object.assign(this.comment, {
      text: this.commentText,
    });
    console.log('Submitting comment: ', this.comment);

    this.result.emit(this.comment);
    // Clear form fields after submission
    cf.resetForm();
  }

  cancelComment(cf) {
    // Implement comment submission logic here
    console.log('Canceling comment: ', this.parentId);

    this.result.emit(null);
    // Clear form fields after submission
    cf.resetForm();
  }
}
