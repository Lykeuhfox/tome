import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  template: `
    <div class="animate-pulse rounded-lg overflow-hidden" style="background-color: var(--color-surface)">
      <div class="w-full" style="aspect-ratio: 488/680; background-color: var(--color-border)"></div>
      <div class="p-2 space-y-2">
        <div class="h-3 rounded" style="background-color: var(--color-border); width: 75%"></div>
        <div class="h-3 rounded" style="background-color: var(--color-border); width: 50%"></div>
      </div>
    </div>
  `,
})
export class SkeletonCardComponent {}
