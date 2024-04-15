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

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    const tagId = this.route.snapshot.params['id']; //'Software-1712809638524';
    if (!tagId) this.fetchAllTags();
    else {
      this.selectedTagId = tagId;
      this.fetchTagsRelatedTo(tagId);
    }
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
        }
      });
  }

  ngOnDestroy() {
    this.fetchTagsSubscription?.unsubscribe();
  }
}
