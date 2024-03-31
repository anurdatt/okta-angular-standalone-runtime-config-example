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
import { of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

  findSubscription: Subscription;
  saveSubscription: Subscription = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService
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
          if (id == 'new') return of(new Note());
          return this.notesService.findById(id);
        })
      )
      .subscribe(
        (note: Note) => {
          this.isLoadingResults = false;
          this.note = note;
          this.feedback = {};
        },
        (err) => {
          this.isLoadingResults = false;
          this.feedback = {
            type: 'warning',
            message: 'Error occured in loading!',
          };
        }
      );
  }

  save() {
    this.saveSubscription = this.notesService.save(this.note).subscribe(
      (note) => {
        this.note = note;
        this.feedback = {
          type: 'success',
          message: 'Save completed successfully!',
        };
        setTimeout(() => {
          this.feedback = {};
          this.router.navigate(['notes']);
        }, 1000);
      },
      (err) => {
        this.feedback = {
          type: 'failure',
          message: 'Error occured in saving!',
        };
      }
    );
  }

  cancel() {
    this.router.navigate(['notes']);
  }
}
