export class Comment {
  id?: number;
  sourceId: number;
  sourceApp: string;
  author: string;
  text: string;
  date: string;
  parentId?: number;
}
