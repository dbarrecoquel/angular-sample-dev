import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'todos',
    loadChildren: () => import('./todos/todos.routes').then(m => m.TODOS_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];