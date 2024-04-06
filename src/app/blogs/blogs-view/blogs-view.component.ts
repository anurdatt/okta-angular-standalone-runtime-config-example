import { Component } from '@angular/core';
import { Post } from '../post';
import { Tag } from '../Tag';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogListComponent } from '../blog-list/blog-list.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../shared/okta/auth.service';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-blogs-view',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    // MatGridListModule,
    // MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    BlogListComponent,
  ],
  providers: [BlogsService],
  templateUrl: './blogs-view.component.html',
  styleUrl: './blogs-view.component.scss',
})
export class BlogsViewComponent {
  posts: Post[];
  //  = [
  //   {
  //     id: 1,
  //     title: 'First Post',
  //     author: 'Anuran Datta',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //     avatar_image_url:
  //       'https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-material-course-1.jpg',
  //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //     date: 'March 1, 2024',
  //   },
  //   {
  //     id: 2,
  //     title: 'Second Post',
  //     author: 'Anuran Datta',
  //     description:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     avatar_image_url:
  //       'https://s3-us-west-1.amazonaws.com/angular-university/course-images/security-cover-small-v2.png',
  //     content:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     date: 'March 5, 2024',
  //   },
  //   {
  //     id: 3,
  //     title: 'Third Post',
  //     author: 'Anuran Datta',
  //     description:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     avatar_image_url: '',
  //     content:
  //       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
  //     date: 'March 21, 2024',
  //   },
  //   // Add more posts as needed
  // ];

  tags: Tag[] = [
    {
      id: 'Technology-15551',
      name: 'Technology',
    },
    {
      id: 'Science-67698',
      name: 'Science',
    },
    {
      id: 'Software-76977',
      name: 'Software',
    },
    {
      id: 'Programming-15791',
      name: 'Programming',
    },
    {
      id: 'Arts-15443',
      name: 'Arts',
    },
    {
      id: 'Mythology-45234',
      name: 'Mythology',
    },
    {
      id: 'Life-23343',
      name: 'Life',
    },
  ];

  constructor(private route: ActivatedRoute, public authService: AuthService) {}

  ngOnInit(): void {
    this.posts = this.route.snapshot.data['posts'];
  }
}
