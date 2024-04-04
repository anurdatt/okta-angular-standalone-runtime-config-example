import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotesService } from '../notes.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Note } from '../note';
import { of as observableOf, Subscription } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-note-edit',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './note-edit.component.html',
  styleUrl: './note-edit.component.scss',
  providers: [NotesService],
})
export class NoteEditComponent implements OnInit, OnDestroy {
  note: Note;
  feedback: any = {};
  isLoadingResults = true;
  isSavingResults = false;

  findSubscription: Subscription;
  saveSubscription: Subscription = null;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private _snackbar: MatSnackBar
  ) {
    console.log('In note edit component');
  }
  ngOnDestroy(): void {
    if (this.saveSubscription != null) this.saveSubscription.unsubscribe();
    this.findSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.findSubscription = this.route.params
      .pipe(
        map((p) => p['id']),
        switchMap((id) => {
          this.isLoadingResults = true;
          if (id == 'new') return observableOf(new Note());
          return this.notesService.findById(id);
        })
      )
      .pipe(
        catchError((err) => {
          console.error('FindById failed with error : ' + JSON.stringify(err));
          return observableOf(null);
        })
      )
      .subscribe((note: Note) => {
        this.isLoadingResults = false;
        if (note == null) {
          //   this.feedback = {
          //     type: 'warning',
          //     message: 'Error occured in loading!',
          //   };
          this._snackbar.open('Error occured in loading!', 'Failure', {
            // panelClass: ['alert', 'alert-failure'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.note = note;
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

  save() {
    this.isSavingResults = true;
    this.saveSubscription = this.notesService
      .save(this.note)
      .pipe(
        catchError((err) => {
          console.error('Save failed with error : ' + JSON.stringify(err));
          return observableOf(null);
        })
      )
      .subscribe((note) => {
        this.isSavingResults = false;
        if (note == null) {
          //   this.feedback = {
          //     type: 'failure',
          //     message: 'Error occured in saving!',
          //   };
          this._snackbar.open('Error occured in saving!', 'Failure', {
            // panelClass: ['alert', 'alert-failure'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        } else {
          this.note = note;
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
            this.router.navigate(['notes']);
          }, 1000);
        }
      });
  }

  cancel() {
    this.router.navigate(['notes']);
  }
}
