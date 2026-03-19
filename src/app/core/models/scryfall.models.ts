export interface ImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

export interface CardFace {
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  image_uris?: ImageUris;
  power?: string;
  toughness?: string;
  loyalty?: string;
  flavor_text?: string;
  artist?: string;
}

export interface CardLegalities {
  standard: string;
  pioneer: string;
  modern: string;
  legacy: string;
  vintage: string;
  commander: string;
  pauper: string;
  [key: string]: string;
}

export interface CardPrices {
  usd?: string | null;
  usd_foil?: string | null;
  eur?: string | null;
  tix?: string | null;
}

export interface Card {
  id: string;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  image_uris?: ImageUris;
  card_faces?: CardFace[];
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  colors?: string[];
  color_identity: string[];
  keywords: string[];
  legalities: CardLegalities;
  set: string;
  set_name: string;
  rarity: string;
  artist?: string;
  flavor_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  prices: CardPrices;
  related_uris?: Record<string, string>;
}

export interface ScryfallList<T> {
  object: 'list';
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  warnings?: string[];
  data: T[];
}

export interface ScryfallCatalog {
  object: 'catalog';
  total_values: number;
  data: string[];
}

export interface ScryfallError {
  object: 'error';
  code: string;
  status: number;
  details: string;
  warnings?: string[];
}
