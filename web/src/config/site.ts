// Configuración general del sitio. Todo lo marcado con TODO lo tiene que rellenar Orbixel.

/** Ruta base donde se publica la web ('/' en un dominio propio, '/Claude-/' en GitHub Pages). */
export const BASE: string = import.meta.env.BASE_URL || '/';

export const SITE = {
  name: 'ORBIXEL Agency',
  // TODO: dominio definitivo, sin barra final. En GitHub Pages lo pone solo el workflow (VITE_SITE_ORIGIN).
  url: (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || 'https://orbixel.agency',
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

const R = (p: string) => BASE + p;
export const ROUTES: Record<Lang, Record<PageKey, string>> = {
  es: { home: R(''), legal: R('aviso-legal/'), privacy: R('privacidad/'), cookies: R('cookies/') },
  ca: { home: R('ca/'), legal: R('ca/avis-legal/'), privacy: R('ca/privacitat/'), cookies: R('ca/cookies/') },
};

export function resolveRoute(pathname: string): { lang: Lang; page: PageKey } {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  for (const lang of ['es', 'ca'] as Lang[]) {
    for (const [page, path] of Object.entries(ROUTES[lang])) {
      if (path === p) return { lang, page: page as PageKey };
    }
  }
  return { lang: p.startsWith(BASE + 'ca/') ? 'ca' : 'es', page: 'home' };
}

export const whatsappLink = (text: string) =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}` : `mailto:${SITE.email}?subject=${encodeURIComponent(text)}`;
