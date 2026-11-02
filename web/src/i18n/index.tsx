import { createContext, useContext, type ReactNode } from 'react';
import es, { type Dict } from './es';
import ca from './ca';
import type { Lang } from '../config/site';

export const DICTS: Record<Lang, Dict> = { es, ca };

const I18nCtx = createContext<{ lang: Lang; t: Dict }>({ lang: 'es', t: es });

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <I18nCtx.Provider value={{ lang, t: DICTS[lang] }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
