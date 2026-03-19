import { Component, inject, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SearchStateService } from '../../services/search-state.service';

interface FilterChip {
  label: string;
  value: string;
  selected: boolean;
}

@Component({
  selector: 'app-filter-bar',
  imports: [MatChipsModule, MatIconModule],
  template: `
    <div class="flex flex-wrap gap-4 items-center py-2">
      <div class="flex items-center gap-2">
        <span class="text-sm" style="color: var(--color-text-muted)">Colors:</span>
        <mat-chip-listbox multiple aria-label="Color filter" (change)="onColorChange($event)">
          @for (chip of colorChips(); track chip.value) {
            <mat-chip-option [value]="chip.value" [selected]="chip.selected">
              {{ chip.label }}
            </mat-chip-option>
          }
        </mat-chip-listbox>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm" style="color: var(--color-text-muted)">Format:</span>
        <mat-chip-listbox aria-label="Format filter" (change)="onFormatChange($event)">
          @for (chip of formatChips(); track chip.value) {
            <mat-chip-option [value]="chip.value" [selected]="chip.selected">
              {{ chip.label }}
            </mat-chip-option>
          }
        </mat-chip-listbox>
      </div>
    </div>
  `,
})
export class FilterBarComponent {
  private readonly searchState = inject(SearchStateService);

  readonly colorChips = signal<FilterChip[]>([
    { label: 'White', value: 'w', selected: false },
    { label: 'Blue', value: 'u', selected: false },
    { label: 'Black', value: 'b', selected: false },
    { label: 'Red', value: 'r', selected: false },
    { label: 'Green', value: 'g', selected: false },
  ]);

  readonly formatChips = signal<FilterChip[]>([
    { label: 'Standard', value: 'standard', selected: false },
    { label: 'Modern', value: 'modern', selected: false },
    { label: 'Legacy', value: 'legacy', selected: false },
    { label: 'Commander', value: 'commander', selected: false },
  ]);

  onColorChange(event: { value: string[] }): void {
    const selected = event.value ?? [];
    this.colorChips.update((chips) =>
      chips.map((c) => ({ ...c, selected: selected.includes(c.value) }))
    );
    this.applyFilters();
  }

  onFormatChange(event: { value: string | string[] }): void {
    const selected = Array.isArray(event.value) ? event.value : event.value ? [event.value] : [];
    this.formatChips.update((chips) =>
      chips.map((c) => ({ ...c, selected: selected.includes(c.value) }))
    );
    this.applyFilters();
  }

  private applyFilters(): void {
    const baseQuery = this.searchState.query();
    // Strip existing filter clauses
    const stripped = baseQuery.replace(/\s*(c:[a-z]+|f:[a-z]+)/gi, '').trim();

    const colors = this.colorChips()
      .filter((c) => c.selected)
      .map((c) => c.value)
      .join('');
    const format = this.formatChips().find((c) => c.selected);

    let newQuery = stripped;
    if (colors) newQuery += ` c:${colors}`;
    if (format) newQuery += ` f:${format.value}`;

    if (newQuery.trim() && newQuery.trim() !== stripped) {
      this.searchState.search(newQuery.trim());
    }
  }
}
