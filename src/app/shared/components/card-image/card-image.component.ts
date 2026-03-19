import { Component, input, output, computed } from '@angular/core';
import { Card } from '../../../core/models/scryfall.models';

@Component({
  selector: 'app-card-image',
  template: `
    <div
      class="relative rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:z-10"
      (click)="cardClick.emit(card())"
      (keydown.enter)="cardClick.emit(card())"
      tabindex="0"
      role="button"
      [attr.aria-label]="card().name"
    >
      <img
        [src]="imageUrl()"
        [alt]="card().name"
        loading="lazy"
        class="w-full h-auto block"
        style="aspect-ratio: 488/680; object-fit: cover;"
        (error)="onImgError($event)"
      />
    </div>
  `,
})
export class CardImageComponent {
  readonly card = input.required<Card>();
  readonly size = input<'normal' | 'large' | 'png'>('normal');
  readonly cardClick = output<Card>();

  readonly imageUrl = computed(() => {
    const c = this.card();
    const imageUris = c.card_faces?.[0]?.image_uris ?? c.image_uris;
    return imageUris?.[this.size()] ?? imageUris?.['normal'] ?? '';
  });

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://cards.scryfall.io/normal/back/default.jpg';
  }
}
