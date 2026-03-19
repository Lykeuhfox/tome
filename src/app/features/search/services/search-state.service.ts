import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ScryfallService } from '../../../core/services/scryfall.service';
import { Card } from '../../../core/models/scryfall.models';

export const UI_PAGE_SIZE = 60;

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  private readonly scryfallService = inject(ScryfallService);

  // Input state
  readonly query = signal('');
  readonly uiPageIndex = signal(0);

  // Buffer
  private readonly buffer = signal<Card[]>([]);
  private readonly apiPagesFetched = signal(0);
  private readonly apiHasMore = signal(false);

  // Output state
  readonly totalCards = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly viewMode = signal<'grid' | 'list'>('grid');

  // Derived
  readonly results = computed(() => {
    const start = this.uiPageIndex() * UI_PAGE_SIZE;
    return this.buffer().slice(start, start + UI_PAGE_SIZE);
  });

  readonly isEmpty = computed(
    () => !this.loading() && this.buffer().length === 0 && this.query() !== ''
  );

  search(query: string): void {
    this.query.set(query);
    this.buffer.set([]);
    this.uiPageIndex.set(0);
    this.apiPagesFetched.set(0);
    this.apiHasMore.set(false);
    this.totalCards.set(0);
    this.error.set(null);
    this.fetchApiPage(1);
  }

  goToPage(pageIndex: number): void {
    this.uiPageIndex.set(pageIndex);
    const needed = (pageIndex + 1) * UI_PAGE_SIZE;
    if (needed > this.buffer().length && this.apiHasMore()) {
      this.fetchApiPage(this.apiPagesFetched() + 1);
    }
  }

  private fetchApiPage(apiPage: number): void {
    const q = this.query();
    if (!q) return;

    this.loading.set(true);
    this.scryfallService.search(q, apiPage).subscribe({
      next: (result) => {
        this.buffer.update((prev) => [...prev, ...result.data]);
        this.totalCards.set(result.total_cards);
        this.apiHasMore.set(result.has_more);
        this.apiPagesFetched.set(apiPage);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const details = err.error?.details ?? err.message ?? 'An error occurred.';
        this.error.set(details);
        this.loading.set(false);
      },
    });
  }
}
