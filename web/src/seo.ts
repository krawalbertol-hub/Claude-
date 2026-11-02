import { DICTS } from './i18n';
import { LEGAL } from './i18n/legal';
import { BASE, ROUTES, SITE, resolveRoute } from './config/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Etiquetas <head> por página: título, descripción, canonical, hreflang, Open Graph y datos estructurados. */
export function buildHead(url: string): string {
  const { lang, page } = resolveRoute(url);
  const t = DICTS[lang];
  const isHome = page === 'home';
  const title = isHome ? t.meta.title : `${LEGAL[lang][page].title} · ORBIXEL Agency`;
  const desc = t.meta.description;
  const canonical = SITE.url + ROUTES[lang][page];
  const og = `${SITE.url}${BASE}og-image.png`;
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="es" href="${SITE.url + ROUTES.es[page]}" />`,
    `<link rel="alternate" hreflang="ca" href="${SITE.url + ROUTES.ca[page]}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE.url + ROUTES.es[page]}" />`,
    isHome ? '' : '<meta name="robots" content="noindex, follow" />',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="ORBIXEL Agency" />`,
    `<meta property="og:locale" content="${lang === 'es' ? 'es_ES' : 'ca_ES'}" />`,
    `<meta property="og:locale:alternate" content="${lang === 'es' ? 'ca_ES' : 'es_ES'}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(t.meta.ogAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${og}" />`,
  ];
  if (isHome) {
    const business = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${SITE.url}${BASE}#business`,
      name: 'ORBIXEL Agency',
      alternateName: 'Orbixel',
      description: desc,
      url: SITE.url + ROUTES[lang].home,
      logo: `${SITE.url}${BASE}icon-512.png`,
      image: og,
      email: SITE.email,
      ...(SITE.phone ? { telephone: SITE.phone } : {}),
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE.address.locality,
        addressRegion: SITE.address.region,
        postalCode: SITE.address.postalCode,
        addressCountry: SITE.address.country,
      },
      geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Girona' }, { '@type': 'Country', name: 'España' }],
      knowsLanguage: ['es', 'ca'],
      sameAs: [SITE.social.instagram, SITE.social.linkedin].filter(Boolean),
      makesOffer: {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: lang === 'es' ? 'Diagnóstico de procesos e IA' : 'Diagnòstic de processos i IA' },
      },
    };
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: t.faq.items.map((f, i) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: i === 0 && SITE.diagnosisPriceFrom ? t.faq.priceWith(SITE.diagnosisPriceFrom) : f.a },
      })),
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(business).replace(/</g, '\\u003c')}</script>`);
    tags.push(`<script type="application/ld+json">${JSON.stringify(faq).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.filter(Boolean).join('\n    ');
}

export function allRoutes(): string[] {
  return (['es', 'ca'] as const).flatMap((l) => Object.values(ROUTES[l]));
}
