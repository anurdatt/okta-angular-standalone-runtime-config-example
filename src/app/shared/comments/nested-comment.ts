import { Comment } from './comment';

export class NestedComment {
  comment: Comment;
  comments: NestedComment[];
}
