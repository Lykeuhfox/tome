# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Tome** — Angular 21 SPA for searching Magic: The Gathering cards via the [Scryfall public API](https://scryfall.com/docs/api).

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Angular 21, standalone components, no NgModules |
| Component library | Angular Material v21 (M3 dark theme) |
| Styling | Tailwind CSS v4 (PostCSS plugin) + SCSS |
| State | Angular Signals (`signal`, `computed`) in injectable services |
| HTTP | `HttpClient` with `provideHttpClient(withFetch())` + functional interceptors |
| Build | esbuild (Angular default) |
| Testing | Vitest via `@angular/build:unit-test` |

## Project Structure

```
src/
  app/
    core/
      interceptors/scryfall.interceptor.ts   # sets User-Agent on all API calls
      models/scryfall.models.ts              # Card, CardFace, ScryfallList, etc.
      services/scryfall.service.ts           # all Scryfall HTTP calls
    shared/
      components/
        skeleton-card/                       # Tailwind animate-pulse placeholder
        card-image/                          # image with DFC (card_faces) handling
      pipes/mana-symbol.pipe.ts             # renders {W}{U} as styled symbols
    features/
      search/
        components/
          search/                            # feature shell component
          search-bar/                        # mat-autocomplete wired to /cards/autocomplete
          card-grid/                         # grid/list toggle + mat-paginator
          card-detail-dialog/               # mat-dialog with full card info
          filter-bar/                        # mat-chip-listbox for color/format filters
        services/search-state.service.ts    # all search signals + pagination logic
        search.routes.ts
    app.config.ts
    app.routes.ts
    app.ts
  tailwind.css     # @import "tailwindcss" + CSS custom properties
  styles.scss      # Angular Material M3 dark theme
```

## Key Architecture Notes

### Pagination
- Scryfall API returns up to 175 cards/page; UI shows 60/page (`UI_PAGE_SIZE`)
- `SearchStateService` buffers API results in a `signal<Card[]>`
- On UI page change, fetches the next API page only when `(uiPageIndex + 1) * 60 > buffer.length`

### Tailwind v4 Integration
- PostCSS plugin via `postcss.config.mjs`
- `src/tailwind.css` is listed first in `angular.json` styles array (before `styles.scss`)
- CSS custom properties (`--color-bg`, etc.) defined in `tailwind.css`

### Double-Faced Cards
- Top-level `image_uris` is null for DFC cards
- Always check `card.card_faces?.[0]?.image_uris ?? card.image_uris`

### Angular Material Theming
- Angular CLI version: 21.x (not 19 as originally planned)
- Theme defined with `mat.theme()` mixin in `styles.scss`
- `@use '@angular/material'` must be the FIRST rule in any SCSS file using Material

## Common Commands

```bash
ng serve          # dev server at localhost:4200
ng build          # production build to dist/tome/
ng test           # Vitest unit tests
```

## Scryfall API Notes

- Rate limit: debounce autocomplete 300ms, search 500ms
- Error shape: `{ object: 'error', status, code, details }` — show `details` to user
- `has_more` + `next_page` on list responses indicate more API pages
- `total_cards` is the total result count for paginator `[length]` binding
