import { ui, defaultLang, type SupportedLanguage, languages } from './ui';

export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
    return lang as SupportedLanguage;
  }
  return defaultLang;
}

export function useTranslations(lang: SupportedLanguage) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    const dict = ui[lang] || ui[defaultLang];
    return dict[key] ?? ui[defaultLang][key] ?? key;
  };
}

export function getLocalizedPath(currentPath: string, targetLang: SupportedLanguage): string {
  const segments = currentPath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return `/${targetLang}/`;
  }
  if (segments[0] in languages) {
    segments[0] = targetLang;
  } else {
    segments.unshift(targetLang);
  }
  return `/${segments.join('/')}/`;
}

export function formatDate(date: Date | string, lang: SupportedLanguage): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
