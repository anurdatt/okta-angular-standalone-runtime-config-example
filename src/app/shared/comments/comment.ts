export class Comment {
  id?: string;
  sourceId: string | number;
  sourceApp: string;
  author: string;
  text: string;
  date: string;
  parentId?: string;
}
