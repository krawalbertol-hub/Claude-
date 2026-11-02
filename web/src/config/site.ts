// Configuración general del sitio. Todo lo marcado con TODO lo tiene que rellenar Orbixel.
export const SITE = {
  name: 'ORBIXEL Agency',
  // TODO: dominio definitivo (también en public/robots.txt se genera solo en el build)
  url: 'https://orbixel.agency',
  email: 'contact.orbixel@gmail.com',
  // TODO: teléfono en formato internacional sin espacios ni «+», p. ej. 34600111222
  whatsapp: '' as string,
  // TODO: teléfono visible, p. ej. '+34 600 11 12 22'
  phone: '' as string,
  address: {
    locality: 'Santa Coloma de Farners',
    region: 'Girona',
    postalCode: '17430',
    country: 'ES',
  },
  geo: { lat: 41.8597, lng: 2.6672 },
  social: {
    instagram: 'https://www.instagram.com/orbixel.agency/',
    // TODO: añadir LinkedIn / TikTok cuando existan
    linkedin: '' as string,
  },
  // TODO: si queréis mostrar precio en la FAQ, p. ej. '290 €'. Vacío = texto genérico.
  diagnosisPriceFrom: '' as string,
  analytics: {
    // TODO: ID de Google Analytics 4 (G-XXXXXXX). Solo se carga si el usuario acepta cookies.
    ga4Id: '' as string,
  },
} as const;

export type Lang = 'es' | 'ca';

export type PageKey = 'home' | 'legal' | 'privacy' | 'cookies';

export const ROUTES: Record<Lang, Record<PageKey, string>> = {
  es: { home: '/', legal: '/aviso-legal/', privacy: '/privacidad/', cookies: '/cookies/' },
  ca: { home: '/ca/', legal: '/ca/avis-legal/', privacy: '/ca/privacitat/', cookies: '/ca/cookies/' },
};

export function resolveRoute(pathname: string): { lang: Lang; page: PageKey } {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  for (const lang of ['es', 'ca'] as Lang[]) {
    for (const [page, path] of Object.entries(ROUTES[lang])) {
      if (path === p) return { lang, page: page as PageKey };
    }
  }
  return { lang: p.startsWith('/ca/') ? 'ca' : 'es', page: 'home' };
}

export const whatsappLink = (text: string) =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}` : `mailto:${SITE.email}?subject=${encodeURIComponent(text)}`;
