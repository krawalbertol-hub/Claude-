import { useI18n } from '../../i18n';
import { ROUTES, SITE, whatsappLink } from '../../config/site';
import { OrbixelLogo } from '../brand/Logo';
import { Icon } from '../ui/Icon';

export function Footer({ onCookieSettings }: { onCookieSettings: () => void }) {
  const { t, lang } = useI18n();
  const f = t.footer;
  const r = ROUTES[lang];
  return (
    <footer className="relative border-t border-line bg-bg/80 backdrop-blur">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href={r.home} aria-label={t.a11y.home} className="inline-block rounded-md">
            <OrbixelLogo className="h-9 w-auto" />
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{f.tagline}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{f.contact}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a className="link-underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            {SITE.phone && <li><a className="link-underline" href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a></li>}
            <li><a className="link-underline" href={whatsappLink(t.contact.whatsappText)} target="_blank" rel="noopener noreferrer">WhatsApp<span className="sr-only"> {t.a11y.external}</span></a></li>
            <li className="text-muted">{SITE.address.locality} ({SITE.address.region})</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{f.social}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a className="inline-flex items-center gap-2 link-underline" href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">
                <Icon name="instagram" className="size-4" /> Instagram<span className="sr-only"> {t.a11y.external}</span>
              </a>
            </li>
            {SITE.social.linkedin && (
              <li>
                <a className="inline-flex items-center gap-2 link-underline" href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Icon name="linkedin" className="size-4" /> LinkedIn<span className="sr-only"> {t.a11y.external}</span>
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{f.legal}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a className="link-underline" href={r.legal}>{f.legalLinks.legal}</a></li>
            <li><a className="link-underline" href={r.privacy}>{f.legalLinks.privacy}</a></li>
            <li><a className="link-underline" href={r.cookies}>{f.legalLinks.cookies}</a></li>
            <li><button type="button" className="link-underline text-left" onClick={onCookieSettings}>{f.cookieSettings}</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} ORBIXEL Agency.</p>
          <p>{f.rights}</p>
        </div>
      </div>
    </footer>
  );
}
