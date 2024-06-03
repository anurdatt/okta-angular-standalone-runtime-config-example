import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxeditorComponent } from './ngxeditor.component';
import { Post } from '../model/post';
import { BlogsService } from '../blogs.service';
import { Observable, Subscription, of as observableOf } from 'rxjs';
import { switchMap, catchError, map, startWith } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/okta/auth.service';
// import { ScrollTopComponent } from '../../shared/scroll/scroll-top.component';
import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { PostWithTags } from '../model/post-with-tags';
import { Tag } from '../model/tag';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { ENTER, COMMA, T } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { isObject } from '@okta/okta-auth-js';
import { TagsService } from '../../tags/tags.service';
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
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,

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
  tags: Tag[];
  isLoadingResults = true;
  isSavingResults = false;
  feedback: any = {};
  findSubscription: Subscription;
  saveSubscription: Subscription;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags$: Observable<Tag[]>;
  fetchedTags: Tag[];
  allTags: Tag[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BlogsService,
    private authService: AuthService,
    private _snackbar: MatSnackBar,
    private location: Location,
    private tagsService: TagsService
  ) {
    // super();
    this.filteredTags$ = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: Tag | string | null) => {
        console.log(
          `Tag `,
          { tag },
          `instanceof Tag = ${tag instanceof Tag}`,
          `isObject = ${isObject(tag)}`
        );

        if (tag instanceof Tag || isObject(tag)) {
          return this.allTags;
        }

        return tag ? this._filter(tag) : this.allTags; //.splice(0)
      })
    );
  }

  // @HostListener('window:scroll', ['$event'])
  // OnScroll($event: any) {
  //   console.log('Scroll event : ' + JSON.stringify($event));
  //   console.log('window scrol top = ' + window.scrollY);
  // }

  ngOnInit(): void {
    this.findSubscription = this.route.params
      .pipe(
        // map((p) => p['id']),
        map((p) => p['url']),
        switchMap((url) => {
          this.isLoadingResults = true;
          if (url == 'new')
            return observableOf([{ post: new Post(), tags: [] }]);
          // return this.service.findPostById(id).pipe(
          return this.service.findPostsByUrl(url).pipe(
            catchError((err) => {
              console.error(
                'FindByUrl failed with error : ' + JSON.stringify(err)
              );

              return observableOf(null);
            })
          );
        })
      )
      .subscribe((postWithTagsList: PostWithTags[]) => {
        this.isLoadingResults = false;
        if (postWithTagsList == null || postWithTagsList.length == 0) {
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
          this.post = postWithTagsList[0].post;
          this.tags = postWithTagsList[0].tags;
          // this.feedback = {};

          this._snackbar.open('Load completed successfully!', 'Success', {
            // panelClass: ['alert', 'alert-success'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1000,
          });

          this.fetchAllTags();
        }
      });
  }

  async add(event: MatChipInputEvent): Promise<void> {
    const value = (event.value || '').trim();

    // Add our tag
    if (
      value &&
      !this.fetchedTags.find(
        (t) => t.name.toLocaleLowerCase() == value.toLocaleLowerCase()
      )
    ) {
      const tag = await this.addNewTag({ id: null, name: value });
      if (tag) {
        this.tags.push(tag);
        this.fetchAllTags();
      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: Tag) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.syncAllTags();
      this.announcer.announce(`Removed ${tag.name}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // this.allTags.splice(this.allTags.indexOf(event.option.value), 1);
    this.tags.push(event.option.value);
    this.syncAllTags();
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): Tag[] {
    console.log({ value });
    const filterValue = value['toLocaleLowerCase']();
    console.log({ filterValue });
    return this.allTags.filter((tag) =>
      tag.name['toLocaleLowerCase']().includes(filterValue)
    );
  }

  syncAllTags() {
    this.allTags = this.fetchedTags.filter(
      (tag) => !this.tags.map((t) => t.name).includes(tag.name)
    );

    this.tagCtrl.setValue('');
  }

  async addNewTag(tag: Tag): Promise<Tag> {
    this.isSavingResults = true;
    let newTag = null;
    try {
      newTag = await this.tagsService.newTag(tag);
      this.isSavingResults = false;
      this._snackbar.open('Save new tag completed successfully!', 'Success', {
        // panelClass: ['alert', 'alert-success'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 1000,
      });
    } catch (err) {
      this.isSavingResults = false;
      console.error('Post new tag failed with error : ' + JSON.stringify(err));
      this._snackbar.open('Error occured in saving new Tag!', 'Failure', {
        // panelClass: ['alert', 'alert-failure'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }

    return newTag;
  }

  fetchAllTags() {
    this.isLoadingResults = true;

    this.tagsService
      .findAll()
      .pipe(
        catchError((err) => {
          console.error(
            'FindAll tags failed with error : ' + JSON.stringify(err)
          );
          return observableOf(null);
        })
      )
      .subscribe((tags: Tag[]) => {
        this.isLoadingResults = false;
        if (tags == null) {
          console.error('Tags fetch failed..');

          this._snackbar.open('Error occured in loading Tags!', 'Failure', {
            // panelClass: ['alert', 'alert-failure'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          // this.allTags = tags;
          this.fetchedTags = tags;
          this.syncAllTags();

          this._snackbar.open('Load tags completed successfully!', 'Success', {
            // panelClass: ['alert', 'alert-success'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1000,
          });
        }
      });

    // this.allTags = [
    //   {
    //     id: 'Technology-15551',
    //     name: 'Technology',
    //   },
    //   {
    //     id: 'Science-67698',
    //     name: 'Science',
    //   },
    //   {
    //     id: 'Software-76977',
    //     name: 'Software',
    //   },
    //   {
    //     id: 'Programming-15791',
    //     name: 'Programming',
    //   },
    //   {
    //     id: 'Arts-15443',
    //     name: 'Arts',
    //   },
    //   {
    //     id: 'Mythology-45234',
    //     name: 'Mythology',
    //   },
    //   {
    //     id: 'Life-23343',
    //     name: 'Life',
    //   },
    // ];
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
      .save({ post: this.post, tags: this.tags })
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
          this.post = p.post;
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
