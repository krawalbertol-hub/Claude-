import { SITE } from '../config/site';

export type Consent = 'accepted' | 'rejected' | null;
const KEY = 'orbixel-consent';

export function getConsent(): Consent {
  try { return (localStorage.getItem(KEY) as Consent) ?? null; } catch { return null; }
}
export function setConsent(c: Exclude<Consent, null>) {
  try { localStorage.setItem(KEY, c); } catch { /* sin almacenamiento */ }
  if (c === 'accepted') loadAnalytics();
}

let loaded = false;
// La analítica SOLO se carga aquí, tras el consentimiento explícito.
export function loadAnalytics() {
  if (loaded || !SITE.analytics.ga4Id) return;
  loaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.analytics.ga4Id}`;
  document.head.appendChild(s);
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() { // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag('js', new Date());
  w.gtag('config', SITE.analytics.ga4Id, { anonymize_ip: true });
}
