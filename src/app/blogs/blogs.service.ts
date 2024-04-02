import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './post';
import { environment } from '../../environments/environment';

const headers = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('content-Type', 'application/json');

@Injectable({
  providedIn: 'root',
})
export class BlogsService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Post[]> {
    const url = `${environment.blogsApiUrl}/api/posts`;
    const params = new HttpParams();
    return this.http.get<Post[]>(url, { headers, params });
  }

  findPostById(id: string): Observable<Post> {
    const url = `${environment.blogsApiUrl}/api/posts/${id}`;
    const params = new HttpParams();
    return this.http.get<Post>(url, { headers, params });
  }

  deletePostById(id: string): Observable<any> {
    const url = `${environment.blogsApiUrl}/api/posts/${id}`;
    const params = new HttpParams();
    return this.http.delete<any>(url, { headers, params });
  }

  save(entity: Post): Observable<Post> {
    let url = '';
    if (entity.id) {
      url = `${environment.blogsApiUrl}/api/posts/${entity.id}`;
      return this.http.put<Post>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    } else {
      url = `${environment.blogsApiUrl}/api/posts`;
      return this.http.post<Post>(url, entity, {
        headers,
        params: new HttpParams(),
      });
    }
  }
}
