import { Routes } from '@angular/router';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./todo-list/todo-list').then(m => m.TodoList)
  },
  {
    path: 'new',
    loadComponent: () => import('./todo-form/todo-form').then(m => m.TodoForm)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./todo-form/todo-form').then(m => m.TodoForm)
  }
];