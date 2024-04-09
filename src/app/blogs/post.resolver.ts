import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './model/post';
import { BlogsService } from './blogs.service';
import { PostWithTags } from './model/post-with-tags';

export function postResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<PostWithTags> {
  const service: BlogsService = inject(BlogsService);
  return service.findPostById(route.params['id']);
}
