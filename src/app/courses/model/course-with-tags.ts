import { Tag } from '../../tags/model/tag';
import { Course } from './course';

export class CourseWithTags {
  course: Course;
  tags: Tag[];
}
