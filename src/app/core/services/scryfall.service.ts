import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Card, ScryfallList, ScryfallCatalog } from '../models/scryfall.models';

const BASE_URL = 'https://api.scryfall.com';

@Injectable({ providedIn: 'root' })
export class ScryfallService {
  private readonly http = inject(HttpClient);

  search(query: string, page = 1): Observable<ScryfallList<Card>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString());
    return this.http.get<ScryfallList<Card>>(`${BASE_URL}/cards/search`, { params });
  }

  autocomplete(q: string): Observable<string[]> {
    const params = new HttpParams().set('q', q);
    return this.http
      .get<ScryfallCatalog>(`${BASE_URL}/cards/autocomplete`, { params })
      .pipe(map((catalog) => catalog.data));
  }
}
