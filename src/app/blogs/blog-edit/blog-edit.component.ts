import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxeditorComponent } from './ngxeditor.component';
import { Post } from '../model/post';
import { BlogsService } from '../blogs.service';
import { Observable, Subscription, of as observableOf } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/okta/auth.service';
// import { ScrollTopComponent } from '../../shared/scroll/scroll-top.component';
import { CommonModule, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { PostWithTags } from '../model/post-with-tags';
// import { ScrollTopButtonComponent } from '../../shared/scroll/scroll-top-button.component';

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
    // ScrollTopButtonComponent,
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
  isSavingResults = false;
  feedback: any = {};
  findSubscription: Subscription;
  saveSubscription: Subscription;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BlogsService,
    private authService: AuthService,
    private _snackbar: MatSnackBar,
    private location: Location
  ) {
    // super();
  }

  @HostListener('window:scroll', ['$event'])
  OnScroll($event: any) {
    console.log('Scroll event : ' + JSON.stringify($event));
    console.log('window scrol top = ' + window.scrollY);
  }

  ngOnInit(): void {
    this.findSubscription = this.route.params
      .pipe(
        map((p) => p['id']),
        switchMap((id) => {
          this.isLoadingResults = true;
          if (id == 'new') return observableOf(new PostWithTags());
          return this.service.findPostById(id).pipe(
            catchError((err) => {
              console.error(
                'FindById failed with error : ' + JSON.stringify(err)
              );

              return observableOf(null);
            })
          );
        })
      )
      .subscribe((postWithTags: PostWithTags) => {
        this.isLoadingResults = false;
        if (postWithTags == null) {
          // this.feedback = {
          //   type: 'warning',
          //   message: 'Error occured in loading!',
          // };

          this._snackbar.open('Error occured in loading!', 'Failure', {
            // panelClass: ['alert', 'alert-failure'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.post = postWithTags.post;
          // this.feedback = {};

          this._snackbar.open('Load completed successfully!', 'Success', {
            // panelClass: ['alert', 'alert-success'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1000,
          });
        }
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
    this.isSavingResults = true;
    this.saveSubscription = this.service
      .save(this.post)
      .pipe(
        catchError((err) => {
          console.log('Save failed with error: ' + JSON.stringify(err));
          return observableOf(null);
        })
      )
      .subscribe((p) => {
        this.isSavingResults = false;
        if (p == null) {
          // this.feedback = {
          //   type: 'failure',
          //   message: 'Error occured in saving!',
          // };
          this._snackbar.open('Error occured in saving!', 'Failure', {
            // panelClass: ['alert', 'alert-failure'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.post = p;
          // this.feedback = {
          //   type: 'success',
          //   message: 'Save completed successfully!',
          // };
          this._snackbar.open('Save completed successfully!', 'Success', {
            // panelClass: ['alert', 'alert-success'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            // duration: 1000,
          });
          setTimeout(() => {
            this.feedback = {};
            this.router.navigate(['blogs']);
          }, 1000);
        }
      });
  }

  cancel() {
    // this.router.navigate(['blogs']);
    this.location.back();
  }
}
