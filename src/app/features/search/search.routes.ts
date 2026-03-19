import { Routes } from '@angular/router';

export const SEARCH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/search/search.component').then((m) => m.SearchComponent),
  },
];
