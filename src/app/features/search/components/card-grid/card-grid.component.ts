import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SearchStateService, UI_PAGE_SIZE } from '../../services/search-state.service';
import { CardImageComponent } from '../../../../shared/components/card-image/card-image.component';
import { SkeletonCardComponent } from '../../../../shared/components/skeleton-card/skeleton-card.component';
import { CardDetailDialogComponent } from '../card-detail-dialog/card-detail-dialog.component';
import { Card } from '../../../../core/models/scryfall.models';

@Component({
  selector: 'app-card-grid',
  imports: [
    DecimalPipe,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    CardImageComponent,
    SkeletonCardComponent,
  ],
  template: `
    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm" style="color: var(--color-text-muted)">
        @if (searchState.totalCards() > 0) {
          {{ searchState.totalCards() | number }} cards found
        }
      </p>
      <div class="flex gap-1">
        <button
          mat-icon-button
          [class.opacity-100]="searchState.viewMode() === 'grid'"
          [class.opacity-40]="searchState.viewMode() !== 'grid'"
          (click)="searchState.viewMode.set('grid')"
          aria-label="Grid view"
        >
          <mat-icon>grid_view</mat-icon>
        </button>
        <button
          mat-icon-button
          [class.opacity-100]="searchState.viewMode() === 'list'"
          [class.opacity-40]="searchState.viewMode() !== 'list'"
          (click)="searchState.viewMode.set('list')"
          aria-label="List view"
        >
          <mat-icon>view_list</mat-icon>
        </button>
      </div>
    </div>

    <!-- Error state -->
    @if (searchState.error()) {
      <div class="p-4 rounded-lg mb-4 text-sm" style="background-color: #2d1515; border: 1px solid #5c2020; color: #f87171">
        <mat-icon class="align-middle mr-2 text-base">error_outline</mat-icon>
        {{ searchState.error() }}
      </div>
    }

    <!-- Empty state -->
    @if (searchState.isEmpty()) {
      <div class="flex flex-col items-center justify-center py-24 gap-4" style="color: var(--color-text-muted)">
        <mat-icon style="font-size: 3rem; width: 3rem; height: 3rem;">search_off</mat-icon>
        <p class="text-lg">No cards found for "{{ searchState.query() }}"</p>
        <p class="text-sm">Try a different search term or adjust your filters.</p>
      </div>
    }

    <!-- Loading skeletons -->
    @if (searchState.loading()) {
      <div [class]="gridClass()">
        @for (_ of skeletons; track $index) {
          <app-skeleton-card />
        }
      </div>
    }

    <!-- Results -->
    @if (!searchState.loading() && searchState.results().length > 0) {
      @if (searchState.viewMode() === 'grid') {
        <div [class]="gridClass()">
          @for (card of searchState.results(); track card.id) {
            <app-card-image [card]="card" (cardClick)="openDetail($event)" />
          }
        </div>
      } @else {
        <div class="flex flex-col gap-2">
          @for (card of searchState.results(); track card.id) {
            <div
              class="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:opacity-80"
              style="background-color: var(--color-surface); border: 1px solid var(--color-border)"
              (click)="openDetail(card)"
            >
              <img
                [src]="getImageUrl(card)"
                [alt]="card.name"
                loading="lazy"
                class="rounded w-10 h-14 object-cover flex-shrink-0"
              />
              <div class="min-w-0">
                <p class="font-medium text-sm truncate">{{ card.name }}</p>
                <p class="text-xs truncate" style="color: var(--color-text-muted)">{{ card.type_line }}</p>
              </div>
              <div class="ml-auto text-xs flex-shrink-0" style="color: var(--color-text-muted)">
                {{ card.set_name }}
              </div>
            </div>
          }
        </div>
      }
    }

    <!-- Paginator -->
    @if (searchState.totalCards() > 0) {
      <mat-paginator
        class="mt-6"
        [length]="searchState.totalCards()"
        [pageSize]="pageSize"
        [pageIndex]="searchState.uiPageIndex()"
        [hidePageSize]="true"
        (page)="onPage($event)"
      />
    }
  `,
})
export class CardGridComponent {
  readonly searchState = inject(SearchStateService);
  private readonly dialog = inject(MatDialog);

  readonly pageSize = UI_PAGE_SIZE;
  readonly skeletons = Array(12);

  gridClass(): string {
    return 'grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
  }

  getImageUrl(card: Card): string {
    const uris = card.card_faces?.[0]?.image_uris ?? card.image_uris;
    return uris?.normal ?? '';
  }

  onPage(event: PageEvent): void {
    this.searchState.goToPage(event.pageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openDetail(card: Card): void {
    this.dialog.open(CardDetailDialogComponent, {
      data: card,
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'card-detail-panel',
    });
  }
}
