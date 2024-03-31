import { Component, Input } from '@angular/core';
import { Course } from '../model/course';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/okta/auth.service';
import { Observable } from 'rxjs';
import { CustomUserClaim } from '@okta/okta-auth-js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses-card-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  @Input()
  courses: Course[];

  cols = 1;

  rowHeight = '500px';

  handsetPortrait = true;

  isAuthenticated$: Observable<boolean>;
  userGroups$: Observable<CustomUserClaim | CustomUserClaim[]>;

  constructor(public authService: AuthService) {
    this.isAuthenticated$ = authService.isAuthenticated$;
    this.userGroups$ = authService.userGroups$;
  }
}
