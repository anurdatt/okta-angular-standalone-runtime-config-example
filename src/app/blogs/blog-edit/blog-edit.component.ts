import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxeditorComponent } from './ngxeditor.component';
import { Post } from '../post';
import { BlogsService } from '../blogs.service';
import { Observable, Subscription, of as observableOf } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/okta/auth.service';
import { ScrollTopComponent } from '../../shared/scroll/scroll-top.component';
import { CommonModule } from '@angular/common';
import { ScrollTopButtonComponent } from '../../shared/scroll/scroll-top-button.component';

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NgxeditorComponent,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ScrollTopButtonComponent,
  ],
  templateUrl: './blog-edit.component.html',
  styleUrl: './blog-edit.component.scss',
})
// extends ScrollTopComponent
export class BlogEditComponent implements OnInit, OnDestroy {
  @ViewChild(NgxeditorComponent)
  editor: NgxeditorComponent;

  post: Post;
  isLoadingResults = true;
  feedback: any = {};
  findSubscription: Subscription;
  saveSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BlogsService,
    private authService: AuthService
  ) {
    // super();
  }

  ngOnInit(): void {
    this.findSubscription = this.route.params
      .pipe(
        map((p) => p['id']),
        switchMap((id) => {
          this.isLoadingResults = true;
          if (id == 'new') return observableOf(new Post());
          return this.service.findPostById(id).pipe(
            catchError((err) => {
              console.error('FindById failed with error : ' + err);
              this.feedback = {
                type: 'warning',
                message: 'Error occured in loading!',
              };
              this.isLoadingResults = false;
              return observableOf(null);
            })
          );
        })
      )
      .subscribe((post: Post) => {
        this.post = post;
        this.feedback = {};
        this.isLoadingResults = false;
      });
  }

  ngOnDestroy(): void {
    this.findSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }

  async save() {
    console.log(this.post.title);
    // this.post.title = this.post.title.replace(/'/g, "\\'"); //replaceAll("'", "\\\\'");
    // console.log(this.post.title);
    // this.post.title.replace(/\'/g, "\\'");
    this.post.content = JSON.stringify(this.editor.doc);
    this.post.author = await this.authService.getUserFullname();
    this.post.date = new Date().toISOString().split('T')[0]; // new Date().toLocaleDateString('en-GB');

    console.log(`saving post : ${JSON.stringify(this.post)}`);
    this.isLoadingResults = true;
    this.saveSubscription = this.service
      .save(this.post)
      .pipe(
        catchError((err) => {
          console.log('Save failed with error: ' + JSON.stringify(err));
          return observableOf(null);
        })
      )
      .subscribe((p) => {
        this.post = p;
        this.isLoadingResults = false;
        if (p == null) {
          this.feedback = {
            type: 'failure',
            message: 'Error occured in saving!',
          };
        } else {
          this.feedback = {
            type: 'success',
            message: 'Save completed successfully!',
          };
        }
        setTimeout(() => {
          this.feedback = {};
          this.router.navigate(['blogs']);
        }, 1000);
      });
  }

  cancel() {
    this.router.navigate(['blogs']);
  }
}
