import { Note } from './note';
import { NoteFilter } from './note-filter';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class NotesService {
  // noteList: Note[] = [];
  // size$ = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  // load(filter: NoteFilter): void {
  //   this.find(filter).subscribe({
  //     next: (result: Note[]) => (this.noteList = result),
  //     error: (err) => console.error('error loading', err),
  //   });
  // }

  // find(filter: NoteFilter): Observable<Note[]> {
  //   const params: any = {
  //     title: filter.title,
  //     sort: `${filter.column},${filter.direction}`,
  //     size: filter.size,
  //     page: filter.page,
  //   };

  //   if (!filter.direction) delete params.sort;

  //   const userNotesUrl = `${environment.apiUrl}/user/notes`;
  //   return this.http.get(userNotesUrl, { params, headers }).pipe(
  //     map((response: any) => {
  //       this.size$.next(response.totalElements);
  //       return response.content;
  //     })
  //   );
  // }

  search(
    filter: NoteFilter,
    sort: string,
    order: string,
    size: number,
    page: number
  ): Observable<any> {
    const params: any = {
      title: filter.title,
      sort: `${sort},${order}`,
      size: size,
      page: page,
    };

    if (!order || order === '') delete params.sort;

    const userNotesUrl = `${environment.apiUrl}/user/notes`;
    return this.http.get(userNotesUrl, { params, headers });
  }

  delete(entity: Note): Observable<Note> {
    if (entity.id) {
      const url = `${environment.apiUrl}/api/notes/${entity.id.toString()}`;
      const params = new HttpParams(); //.set('ID', entity.id.toString());
      return this.http.delete<Note>(url, { headers, params });
    }
    return null;
  }

  findById(id: number): Observable<Note> {
    const url = `${environment.apiUrl}/api/notes/${id}`;
    const params = new HttpParams();
    return this.http.get<Note>(url, { headers, params });
  }

  save(entity: Note): Observable<Note> {
    let url = '';
    if (entity.id) {
      url = `${environment.apiUrl}/api/notes/${entity.id}`;
      return this.http.put<Note>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    } else {
      url = `${environment.apiUrl}/api/notes`;
      return this.http.post<Note>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    }
  }
}
