import { environment } from '../../../environments/environment';

export const SUPPORTED_LANGUAGES: readonly string[] = environment.supportedLanguages;

export const DEFAULT_LANGUAGE: string = environment.defaultLanguage;

export function isSupportedLanguage(lang: string | null | undefined): lang is string {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang);
}

export interface LocalePathSplit {
  lang: string;
  rest: string;
}

export function detectLangFromPathname(pathname: string): LocalePathSplit {
  const trimmed = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const slashIdx = trimmed.indexOf('/');
  const head = slashIdx === -1 ? trimmed : trimmed.slice(0, slashIdx);

  if (isSupportedLanguage(head)) {
    const tail = slashIdx === -1 ? '' : trimmed.slice(slashIdx + 1);
    const rest = '/' + tail;
    return { lang: head, rest: rest === '/' ? '/' : rest.replace(/\/+$/, '') || '/' };
  }

  return { lang: DEFAULT_LANGUAGE, rest: pathname === '' ? '/' : pathname };
}

export function prefixPathWithLang(path: string, lang: string): string {
  if (lang === DEFAULT_LANGUAGE) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : '/' + path;
  if (normalized === '/') {
    return '/' + lang;
  }
  return '/' + lang + normalized;
}
