import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NestedComment } from './nested-comment';
import { environment } from '../../../environments/environment';

const headers = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  findAllNested(
    sourceApp: string,
    sourceId: string
  ): Observable<NestedComment[]> {
    let url = null;
    if (sourceApp === 'BLOG') {
      url = `${environment.blogsApiUrl}/api/nested-comments`;
    }
    if (url == null)
      throw new Error('Invalid argument passed for sourceApp !!');

    const params = new HttpParams().set('sourceId', sourceId);
    return this.http.get<NestedComment[]>(url, { headers, params });
  }
}
