import { useI18n } from '../../i18n';
import { ROUTES } from '../../config/site';
import { setConsent } from '../../lib/consent';

/** Banner de cookies: Aceptar y Rechazar con el mismo peso visual. Nada de analítica hasta aceptar. */
export function CookieBanner({ onClose }: { onClose: () => void }) {
  const { t, lang } = useI18n();
  const choose = (c: 'accepted' | 'rejected') => { setConsent(c); onClose(); };
  return (
    <div
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-xl rounded-2xl border border-line-strong bg-surface-2/95 p-4 shadow-2xl backdrop-blur-xl sm:bottom-5 sm:p-6 md:left-auto md:right-5 md:mx-0"
    >
      <h2 id="cookie-title" className="font-display text-base font-semibold sm:text-lg">{t.cookies.title}</h2>
      <p id="cookie-text" className="mt-1.5 text-[0.8rem] leading-snug text-soft sm:text-sm sm:leading-relaxed">
        {t.cookies.text}{' '}
        <a href={ROUTES[lang].cookies} className="font-semibold text-fg underline decoration-cyan/60 underline-offset-4">{t.footer.legalLinks.cookies}</a>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-5">
        <button type="button" onClick={() => choose('rejected')} className="btn border border-fg/80 bg-transparent text-fg hover:bg-white/10">{t.cookies.reject}</button>
        <button type="button" onClick={() => choose('accepted')} className="btn border border-fg/80 bg-transparent text-fg hover:bg-white/10">{t.cookies.accept}</button>
      </div>
    </div>
  );
}
