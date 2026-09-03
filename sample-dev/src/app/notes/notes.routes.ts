import { Routes } from '@angular/router';

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./note-list/note-list').then(m => m.NoteList)
  },
  {
    path: 'new',
    loadComponent: () => import('./note-form/note-form').then(m => m.NoteForm)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./note-form/note-form').then(m => m.NoteForm)
  }
];
