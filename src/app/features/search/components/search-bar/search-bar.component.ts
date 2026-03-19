import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  Subject,
  takeUntil,
} from 'rxjs';
import { of } from 'rxjs';
import { ScryfallService } from '../../../../core/services/scryfall.service';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <form class="w-full">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Search cards…</mat-label>
        <input
          matInput
          [formControl]="searchControl"
          [matAutocomplete]="auto"
          (keydown.enter)="onKeyEnter($event)"
        />
        @if (searchControl.value) {
          <button
            matSuffix
            mat-icon-button
            type="button"
            aria-label="Clear"
            (click)="clear()"
          >
            <mat-icon>close</mat-icon>
          </button>
        } @else {
          <mat-icon matSuffix>search</mat-icon>
        }
      </mat-form-field>

      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onOptionSelected($event.option.value)">
        @for (option of suggestions(); track option) {
          <mat-option [value]="option">{{ option }}</mat-option>
        }
      </mat-autocomplete>
    </form>
  `,
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private readonly scryfallService = inject(ScryfallService);
  private readonly searchState = inject(SearchStateService);
  private readonly destroy$ = new Subject<void>();

  readonly searchControl = new FormControl('');
  readonly suggestions = signal<string[]>([]);
  private _optionJustSelected = false;

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => {
        if (!q || q.length < 2) return of([]);
        return this.scryfallService.autocomplete(q).pipe(catchError(() => of([])));
      }),
      takeUntil(this.destroy$),
    ).subscribe((names) => this.suggestions.set(names));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onKeyEnter(event: Event): void {
    event.preventDefault(); // stop native form submission / page reload
    // mat-autocomplete's host listener fires before ours, so optionSelected (and
    // onOptionSelected) has already run by the time we get here. Use the flag to
    // skip the duplicate search when the user confirmed a suggestion via Enter.
    if (this._optionJustSelected) {
      this._optionJustSelected = false;
      return;
    }
    this.onSubmit();
  }

  onSubmit(): void {
    const q = this.searchControl.value?.trim();
    if (q) {
      this.suggestions.set([]);
      this.searchState.search(q);
    }
  }

  onOptionSelected(value: string): void {
    this._optionJustSelected = true;
    this.searchControl.setValue(value, { emitEvent: false });
    this.searchState.search(value);
  }

  clear(): void {
    this.searchControl.setValue('');
    this.suggestions.set([]);
  }
}
