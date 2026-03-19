import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Card } from '../../../../core/models/scryfall.models';
import { ManaSymbolPipe } from '../../../../shared/pipes/mana-symbol.pipe';

@Component({
  selector: 'app-card-detail-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TitleCasePipe,
    UpperCasePipe,
    ManaSymbolPipe,
  ],
  templateUrl: './card-detail-dialog.component.html',
})
export class CardDetailDialogComponent {
  readonly card: Card = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CardDetailDialogComponent>);

  readonly isDfc = signal(!!this.card.card_faces?.length);

  readonly legalityEntries = signal(
    Object.entries(this.card.legalities ?? {}).map(([format, legal]) => ({ format, legal }))
  );

  price(value: string | null | undefined, symbol: string): string {
    return value ? `${symbol}${value}` : '';
  }
}
