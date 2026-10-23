export interface LocalizedLabel {
  id: string;
  en: string;
}

export interface ThemeItem {
  id: string;
  label: LocalizedLabel;
  description?: LocalizedLabel;
}

export const themes = [
  { id: 'first-love', label: { id: 'Cinta Pertama', en: 'First Love' } },
  { id: 'longing', label: { id: 'Cinta & Kerinduan', en: 'Love & Longing' } },
  { id: 'memory', label: { id: 'Memori & Nostalgia', en: 'Memory & Nostalgia' } },
  { id: 'identity', label: { id: 'Identitas & Kedewasaan', en: 'Identity & Growing Up' } },
  { id: 'letting-go', label: { id: 'Kehilangan & Keikhlasan', en: 'Loss & Letting Go' } },
  { id: 'grief', label: { id: 'Duka & Kesedihan', en: 'Grief' } },
  { id: 'hope', label: { id: 'Harapan & Pemulihan', en: 'Hope & Healing' } },
  { id: 'self-discovery', label: { id: 'Penemuan Jati Diri', en: 'Self-Discovery' } },
  { id: 'distance', label: { id: 'Jarak & Keterasingan', en: 'Distance & Alienation' } },
  { id: 'belonging', label: { id: 'Kesepian & Rasa Memiliki', en: 'Loneliness & Belonging' } },
  { id: 'probability', label: { id: 'Probabilitas & Kebetulan', en: 'Probability & Chance' } },
  { id: 'cosmic-love', label: { id: 'Cinta Kosmis', en: 'Cosmic Love' } },
  { id: 'first-sight', label: { id: 'Cinta pada Pandangan Pertama', en: 'Love at First Sight' } },
  { id: 'unexpected-encounter', label: { id: 'Pertemuan Tak Terduga', en: 'Unexpected Encounters' } },
  { id: 'emotional-awakening', label: { id: 'Awal Tumbuhnya Perasaan', en: 'Emotional Awakening' } },
  { id: 'unfinished-goodbye', label: { id: 'Perpisahan yang Belum Usai', en: 'Unfinished Goodbyes' } },
  { id: 'emotional-stagnation', label: { id: 'Terjebak dalam Perasaan', en: 'Emotional Stagnation' } },
  { id: 'unrequited-love', label: { id: 'Cinta Tak Berbalas', en: 'Unrequited Love' } },
  { id: 'heartbreak', label: { id: 'Patah Hati', en: 'Heartbreak' } },
  { id: 'loneliness', label: { id: 'Kesepian', en: 'Loneliness' } },
  { id: 'nostalgia', label: { id: 'Kerinduan akan Masa Lalu', en: 'Nostalgia' } },
  { id: 'desire', label: { id: 'Hasrat', en: 'Desire' } },
  { id: 'self-sabotage', label: { id: 'Sabotase Diri', en: 'Self-Sabotage' } },
  { id: 'inner-conflict', label: { id: 'Konflik Batin', en: 'Inner Conflict' } },
  { id: 'togetherness', label: { id: 'Kebersamaan', en: 'Togetherness' } },
  { id: 'resilience', label: { id: 'Ketangguhan', en: 'Resilience' } },
] as const;

export type ThemeId = (typeof themes)[number]['id'];

export const themeIds = themes.map((t) => t.id) as [ThemeId, ...ThemeId[]];

export function isValidTheme(id: string): id is ThemeId {
  return themes.some((t) => t.id === id);
}

export function getThemeLabel(themeId: string, lang: 'id' | 'en' = 'id'): string {
  const match = themes.find((t) => t.id === themeId);
  return match ? match.label[lang] : themeId;
}
