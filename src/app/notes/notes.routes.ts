import { Routes } from '@angular/router';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteEditComponent } from './note-edit/note-edit.component';
import { OktaAuthGuard } from '@okta/okta-angular';

export const NOTE_ROUTES: Routes = [
  // { path: '', redirectTo: 'note-list', pathMatch: 'full' },
  { path: '', component: NoteListComponent, pathMatch: 'full' },
  // {
  //   path: 'note-list',
  //   // canActivate: [OktaAuthGuard],
  //   component: NoteListComponent,
  // },
  {
    path: 'note-edit/:id',
    component: NoteEditComponent,
  },
];
