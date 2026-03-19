import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { CardGridComponent } from '../card-grid/card-grid.component';

@Component({
  selector: 'app-search',
  imports: [SearchBarComponent, FilterBarComponent, CardGridComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <header class="mb-8 text-center">
        <h1 class="text-4xl font-bold mb-2" style="color: var(--color-accent)">Tome</h1>
        <p class="text-sm" style="color: var(--color-text-muted)">Magic: The Gathering card search</p>
      </header>

      <div class="mb-4">
        <app-search-bar />
      </div>

      <div class="mb-6">
        <app-filter-bar />
      </div>

      <app-card-grid />
    </div>
  `,
})
export class SearchComponent {}
