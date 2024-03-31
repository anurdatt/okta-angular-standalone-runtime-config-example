import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from './post';
import { BlogsService } from './blogs.service';

export function postResolver(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<Post> {
  const service: BlogsService = inject(BlogsService);
  return service.findPostById(route.params['id']);
}
