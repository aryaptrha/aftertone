export interface LocalizedLabel {
  id: string;
  en: string;
}

export interface GenreItem {
  id: string;
  label: LocalizedLabel;
  description?: LocalizedLabel;
}

export const genres = [
  { id: 'idol-pop', label: { id: 'Idol Pop', en: 'Idol Pop' } },
  { id: 'j-pop', label: { id: 'J-Pop', en: 'J-Pop' } },
  { id: 'indie', label: { id: 'Indie', en: 'Indie' } },
  { id: 'rock', label: { id: 'Rock', en: 'Rock' } },
  { id: 'r-and-b', label: { id: 'R&B', en: 'R&B' } },
  { id: 'city-pop', label: { id: 'City Pop', en: 'City Pop' } },
  { id: 'electronic', label: { id: 'Elektronik', en: 'Electronic' } },
] as const;

export type GenreId = (typeof genres)[number]['id'];

export const genreIds = genres.map((g) => g.id) as [GenreId, ...GenreId[]];

export function isValidGenre(id: string): id is GenreId {
  return genres.some((g) => g.id === id);
}

export function getGenreLabel(genreId: string, lang: 'id' | 'en' = 'id'): string {
  const match = genres.find((g) => g.id === genreId);
  return match ? match.label[lang] : genreId;
}
