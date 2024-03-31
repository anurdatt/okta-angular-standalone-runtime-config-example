import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotesService } from '../notes.service';
import { NoteFilter, FilterEvent } from '../note-filter';
import { Note } from '../note';
import { CommonModule } from '@angular/common';
// import { OKTA_AUTH } from '@okta/okta-angular';
// import OktaAuth from '@okta/okta-auth-js';
import { Subscription, merge, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, startWith, switchMap, map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
  ],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
  providers: [NotesService],
})
export class NoteListComponent implements AfterViewInit, OnDestroy {
  // public total$: Observable<number> | undefined;
  filter = new NoteFilter();
  // user: string = '';
  feedback: any = {};

  resultsLength: number;
  data: Note[];
  displayedColumns: string[] = ['id', 'title', 'text', 'action'];
  isLoadingResults = true;
  isRateLimitReached = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchTitle: BehaviorSubject<FilterEvent> = new BehaviorSubject<FilterEvent>({
    filterColumn: 'title',
    filterValue: '',
  });
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  sortSubscription: Subscription;
  searchSubscription: Subscription;
  deleteSubscription: Subscription = null;
  // get noteList(): Note[] {
  //   return this.noteService.noteList;
  // }

  constructor(
    private _snackbar: MatSnackBar,
    private noteService: NotesService // @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {
    console.log('In note list component');
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.sortSubscription.unsubscribe();
    if (this.deleteSubscription != null) this.deleteSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sortSubscription = this.sort.sortChange.subscribe(
      () => (this.paginator.pageIndex = 0)
    );

    this.searchSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.searchTitle.asObservable()
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.noteService
            .search(
              this.filter,
              this.sort.active,
              this.sort.direction,
              this.paginator.pageSize,
              this.paginator.pageIndex
            )
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.totalElements;
          return data.content;
        })
      )
      .subscribe((data) => (this.data = data));
  }

  // async ngOnInit(): Promise<void> {
  //  // const user = await this.oktaAuth.getUser();
  //  // this.user = JSON.stringify(user, null, 4);
  //   this.search();
  // }

  // search() {
  //   this.noteService.load(this.filter);
  //   this.total$ = this.noteService.size$.asObservable();
  // }

  search() {
    this.paginator.pageIndex = 0;
    this.searchTitle.next({
      filterColumn: 'title',
      filterValue: this.filter.title,
    });
  }

  delete(row: Note, $event: Event) {
    $event.stopPropagation();
    if (confirm('Are you sure?')) {
      this.deleteSubscription = this.noteService.delete(row).subscribe(
        () => {
          // this.feedback = {
          //   type: 'success',
          //   message: 'Delete completed successfully!',
          // };
          this._snackbar.open('Delete completed successfully!', 'Success', {
            // panelClass: ['alert', 'alert-success'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            // duration: 1000,
          });
          setTimeout(() => {
            this.search();
            // this.feedback = {};
          }, 1000);
        },
        (err) => {
          // this.feedback = {
          //   type: 'faiure',
          //   message: 'Error occured in deleting!',
          // };
          this._snackbar.open('Error occured in deleting!', 'Failure', {
            // panelClass: ['alert', 'alert-failure'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      );
    }
  }
}
