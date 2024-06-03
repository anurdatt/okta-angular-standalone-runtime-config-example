import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NestedComment } from './nested-comment';
import { environment } from '../../../environments/environment';
import { Comment } from './comment';

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
    sourceId: number
  ): Observable<NestedComment[]> {
    let url = null;
    if (sourceApp === 'BLOG') {
      url = `${environment.blogsApiUrl}/api/nested-comments`;
    } else if (sourceApp === 'COURSES') {
      url = `${environment.coursesApiUrl}/api/nested-comments`;
    }
    if (url == null)
      throw new Error('Invalid argument passed for sourceApp !!');

    const params = new HttpParams().set('sourceId', sourceId);
    return this.http.get<NestedComment[]>(url, { headers, params });
  }

  deleteCommentById(sourceApp: string, id: number): Observable<any> {
    let url = null;
    if (sourceApp === 'BLOG') {
      url = `${environment.blogsApiUrl}/api/comments/${id}`;
    } else if (sourceApp === 'COURSES') {
      url = `${environment.coursesApiUrl}/api/comments/${id}`;
    }
    if (url == null)
      throw new Error('Invalid argument passed for sourceApp !!');

    const params = new HttpParams();
    return this.http.delete<any>(url, { headers, params });
  }

  save(entity: Comment): Observable<Comment> {
    let url = null;
    if (entity.id) {
      if (entity.sourceApp === 'BLOG') {
        url = `${environment.blogsApiUrl}/api/comments/${entity.id}`;
      } else if (entity.sourceApp === 'COURSES') {
        url = `${environment.coursesApiUrl}/api/comments/${entity.id}`;
      }
      if (url == null)
        throw new Error('Invalid argument passed for sourceApp !!');

      return this.http.put<Comment>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    } else {
      if (entity.sourceApp === 'BLOG') {
        url = `${environment.blogsApiUrl}/api/comments`;
      } else if (entity.sourceApp === 'COURSES') {
        url = `${environment.coursesApiUrl}/api/comments`;
      }
      if (url == null)
        throw new Error('Invalid argument passed for sourceApp !!');
      return this.http.post<Comment>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    }
  }
}
