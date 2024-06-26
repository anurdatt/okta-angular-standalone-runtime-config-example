import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './model/post';
import { environment } from '../../environments/environment';
import { PostWithTags } from './model/post-with-tags';

const headers = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class BlogsService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<PostWithTags[]> {
    const url = `${environment.blogsApiUrl}/api/posts`;
    const params = new HttpParams();
    return this.http.get<PostWithTags[]>(url, { headers, params });
  }

  findPostById(id: number): Observable<PostWithTags> {
    const url = `${environment.blogsApiUrl}/api/posts/${id}/detail`;
    const params = new HttpParams();
    return this.http.get<PostWithTags>(url, { headers, params });
  }

  findPostsByUrl(url: string): Observable<PostWithTags[]> {
    const apiUrl = `${environment.blogsApiUrl}/api/posts`;
    const params = new HttpParams().set('blogUrl', url);
    return this.http.get<PostWithTags[]>(apiUrl, { headers, params });
  }

  deletePostById(id: number): Observable<any> {
    const url = `${environment.blogsApiUrl}/api/posts/${id}`;
    const params = new HttpParams();
    return this.http.delete<any>(url, { headers, params });
  }

  save(entity: PostWithTags): Observable<PostWithTags> {
    let url = '';
    if (entity.post.id) {
      url = `${environment.blogsApiUrl}/api/posts/${entity.post.id}`;
      return this.http.put<PostWithTags>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    } else {
      url = `${environment.blogsApiUrl}/api/posts`;
      return this.http.post<PostWithTags>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    }
  }
}
