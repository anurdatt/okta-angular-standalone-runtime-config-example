import { Tag } from '../../tags/model/tag';
import { Post } from './post';

export class PostWithTags {
  post: Post;
  tags: Tag[];
}
