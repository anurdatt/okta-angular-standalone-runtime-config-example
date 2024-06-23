import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from './model/tag';
import { Observable, of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const headers = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Tag[]> {
    const url = `${environment.blogsApiUrl}/api/tags`;
    const params = new HttpParams();
    return this.http.get<Tag[]>(url, { headers, params });
  }

  newTag(tag: Tag): Promise<Tag> {
    const url = `${environment.blogsApiUrl}/api/tags`;
    const params = new HttpParams();
    return new Promise<Tag>((resolve, reject) => {
      this.http
        .post<Tag>(url, tag, { headers, params })
        .pipe(
          catchError((err) => {
            return observableOf(null);
          })
        )
        .subscribe((tag: Tag) => {
          if (tag == null) reject('Something went wrong!');
          else resolve(tag);
        });
    });
  }
}
