export class NoteFilter {
  title = '';
  column!: string;
  direction!: string;
  page = 0;
  size = 20;
}

export interface FilterEvent {
  filterColumn: String;
  filterValue: String;
}
