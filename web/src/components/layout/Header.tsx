import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import { ROUTES, type PageKey } from '../../config/site';
import { OrbixelLogo, OrbixelSymbol } from '../brand/Logo';
import { CtaButton } from '../ui/CtaButton';
import { scrollToHash } from '../../lib/scroll';

export function Header({ page }: { page: PageKey }) {
  const { t, lang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = page === 'home';
  const homeHref = ROUTES[lang].home;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const navHref = (h: string) => (isHome ? h : homeHref + h);
  const onNav = (e: React.MouseEvent, h: string) => {
    setOpen(false);
    if (isHome) { e.preventDefault(); scrollToHash(h); }
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${scrolled || open ? 'border-b border-line bg-bg/75 backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-violet focus:px-4 focus:py-2 focus:text-white">
        {t.a11y.skip}
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <a href={homeHref} className="shrink-0 rounded-md" data-cursor="" aria-label={t.a11y.home}>
          <OrbixelLogo className="hidden h-7 w-auto min-[480px]:block md:h-8" label="ORBIXEL Agency" />
          <OrbixelSymbol className="size-8 min-[480px]:hidden" title="ORBIXEL Agency" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {t.nav.map((n) => (
              <li key={n.href}>
                <a href={navHref(n.href)} onClick={(e) => onNav(e, n.href)} className="rounded-full px-3.5 py-2 text-sm font-medium text-soft transition-colors hover:text-fg">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch page={page} />
          <CtaButton href={navHref('#contacto')} cursor={t.cta.cursorBook} className="!min-h-10 !px-4 !py-2 text-sm" arrow={false}>
            <span className="hidden sm:inline">{t.cta.primary}</span>
            <span className="sm:hidden">{t.cta.short}</span>
          </CtaButton>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.a11y.menuClose : t.a11y.menuOpen}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span className={`absolute left-0 h-[1.5px] w-4 bg-fg transition-transform duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-fg transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-[1.5px] w-4 bg-fg transition-transform duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Principal móvil" hidden={!open} className="border-t border-line lg:hidden">
        <ul className="container-x flex flex-col py-3">
          {t.nav.map((n) => (
            <li key={n.href}>
              <a href={navHref(n.href)} onClick={(e) => onNav(e, n.href)} className="block py-3 font-display text-2xl font-semibold">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function LangSwitch({ page }: { page: PageKey }) {
  const { t, lang } = useI18n();
  return (
    <div role="group" aria-label={t.a11y.language} className="flex items-center rounded-full border border-line-strong p-0.5 text-xs font-semibold">
      {(['es', 'ca'] as const).map((l) => (
        <a
          key={l}
          href={ROUTES[l][page]}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? 'true' : undefined}
          onClick={() => { try { localStorage.setItem('orbixel-lang', l); } catch { /* */ } }}
          className={`grid h-8 min-w-9 place-items-center rounded-full px-2 uppercase transition-colors ${l === lang ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}
        >
          <span aria-hidden="true">{l}</span>
          <span className="sr-only">{l === 'es' ? 'Castellano' : 'Català'}</span>
        </a>
      ))}
    </div>
  );
}
