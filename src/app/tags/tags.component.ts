import { Component, OnInit, OnDestroy } from '@angular/core';
import { Tag } from '../blogs/model/tag';
import { TagListComponent } from './tag-list/tag-list.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TagsService } from './tags.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { of as observableOf, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [
    RouterLink, 
    CommonModule, 
    TagListComponent, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent implements OnInit, OnDestroy {
  // tags: Tag[] = [
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

  isLoadingResults = true;
  fetchedTags: Tag[] = [];
  selectedTagId: string;
  fetchTagsSubscription: Subscription;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  tagListDivScrollLeft=0;
  tagListDivOffsetWidth=0;
  tagListDivScrollWidth=0;
  tagListDivScrollLeftAllowed=false;
  tagListDivScrollRightAllowed=true;
  

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private _snackbar: MatSnackBar
  ) {}

  cb = (e:Event) => {
    // console.log(e.target['scrollLeft'], e.target['scrollTop'], e.target['scrollWidth'], e.target['clientWidth'], e.target['offsetWidth']);
    this.tagListDivScrollLeft = e.target['scrollLeft'];
    this.tagListDivScrollWidth = e.target['scrollWidth'];
    this.tagListDivOffsetWidth = e.target['offsetWidth'];
    this.tagListDivScrollLeftAllowed = this.tagListDivScrollLeft > 0;
    this.tagListDivScrollRightAllowed = this.tagListDivScrollLeft + this.tagListDivOffsetWidth  < this.tagListDivScrollWidth;
  }

  scroll(by: number) {
    const el = document.getElementById('scrollingDiv');
    el.scrollLeft += by;
    // el.scrollBy({left: el.scrollLeft + by});
  }

  ngOnInit() {
    console.log('In ngOninit()');
    const tagId = this.route.snapshot.params['id']; //'Software-1712809638524';
    if (!tagId) this.fetchAllTags();
    else {
      this.selectedTagId = tagId;
      this.fetchTagsRelatedTo(tagId);
    }
    // setInterval(() => this.count += 10, 1000);
    const el = document.getElementById('scrollingDiv')
    console.log({el});
    el.addEventListener('scroll', this.cb);
    // el.addEventListener('click', (e)=> alert(`You clicked at x = ${e.clientX}`));
  }

  fetchTagsRelatedTo(tagId: string) {
    //TODO: recommended fetch using specific tagid.
    this.fetchAllTags(); //For now simply all tags.
  }

  fetchAllTags() {
    this.isLoadingResults = true;

    this.fetchTagsSubscription = this.tagsService
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

          // this._snackbar.open('Error occured in loading Tags!', 'Failure', {
          //   // panelClass: ['alert', 'alert-failure'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        } else {
          // this.allTags = tags;
          this.fetchedTags = tags;

          // this._snackbar.open('Load tags completed successfully!', 'Success', {
          //   // panelClass: ['alert', 'alert-success'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          //   duration: 1000,
          // });

          if (this.selectedTagId != undefined) {
            const selectedTagIndex = this.fetchedTags.findIndex((tag) => tag.id === this.selectedTagId);
            if (selectedTagIndex >= 0)
            this.fetchedTags = this.fetchedTags.splice(selectedTagIndex, 1).concat(this.fetchedTags);
          }
        }
      });
  }

  ngOnDestroy() {
    console.log('In ngOnDestroy');
    const el = document.getElementById('scrollingDiv')
    console.log({el});
    el.removeEventListener('scroll', this.cb);

    this.fetchTagsSubscription?.unsubscribe();
  }

  // ngAfterViewInit(): void {
  //   // const el = document.getElementById('scrollingDiv')
  //   // console.log({el});
  //   // el.addEventListener('scroll', this.cb, true);
    
  // }
}
