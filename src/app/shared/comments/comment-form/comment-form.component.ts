import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Comment } from '../comment';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent {
  @Input('parentId') parentId: string;
  @Input('placeHolderText') placeHolderText: string;

  @Output() result: EventEmitter<Comment> = new EventEmitter<Comment>();

  comment: Comment = new Comment();

  submitComment() {
    // Implement comment submission logic here
    this.comment.parentId=this.parentId;
    console.log('Submitting comment: ', this.comment);
    this.result.emit(this.comment);
    // Clear form fields after submission
    // this.newComment = {
    //   author: '',
    //   text: '',
    // };
  }

}
