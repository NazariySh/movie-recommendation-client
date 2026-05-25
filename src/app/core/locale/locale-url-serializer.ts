import { Injectable } from '@angular/core';
import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { DEFAULT_LANGUAGE, detectLangFromPathname, prefixPathWithLang } from './locale.constants';

@Injectable()
export class LocaleUrlSerializer extends DefaultUrlSerializer {
  public constructor(private readonly languageService: LanguageService) {
    super();
  }

  public override parse(url: string): UrlTree {
    const { path, tail } = splitPathAndTail(url);
    const { rest } = detectLangFromPathname(path);
    return super.parse(rest + tail);
  }

  public override serialize(tree: UrlTree): string {
    const serialized = super.serialize(tree);
    const lang = this.languageService.current;
    if (lang === DEFAULT_LANGUAGE) {
      return serialized;
    }
    const { path, tail } = splitPathAndTail(serialized);
    return prefixPathWithLang(path, lang) + tail;
  }
}

function splitPathAndTail(url: string): { path: string; tail: string } {
  const qIdx = url.indexOf('?');
  const hIdx = url.indexOf('#');
  const cut = Math.min(
    qIdx === -1 ? url.length : qIdx,
    hIdx === -1 ? url.length : hIdx,
  );
  return { path: url.slice(0, cut), tail: url.slice(cut) };
}
