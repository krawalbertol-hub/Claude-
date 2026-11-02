# Web de ORBIXEL Agency · entrega

- **Web:** `web/` (instrucciones para ejecutar y desplegar en `web/README.md`)
- **Logo y guía de marca:** `brand/` (`brand/guia-de-marca.html` y `brand/README.md`)

## Lo que tenéis que rellenar
| Qué | Dónde |
|---|---|
| Dominio definitivo (ahora `https://orbixel.agency`; también afecta a canonical, sitemap y Open Graph) | `web/src/config/site.ts` → `url` |
| Teléfono y número de WhatsApp (sin él, el botón de WhatsApp abre un email) | `site.ts` → `phone`, `whatsapp` |
| Precio del diagnóstico (opcional; vacío = texto «precio cerrado antes de empezar») | `site.ts` → `diagnosisPriceFrom` |
| LinkedIn u otras redes | `site.ts` → `social` |
| ID de Google Analytics 4 si queréis analítica | `site.ts` → `analytics.ga4Id` |
| Casos reales (3 tarjetas marcadas `[CASO REAL PENDIENTE]`) | `web/src/components/sections/Cases.tsx` → `CASES` |
| Titular, NIF, domicilio, fecha y proveedores en los textos legales (`[TITULAR]`, `[NIF]`…) | `web/src/i18n/legal.ts` |
| Activar avisos de Netlify Forms o configurar `VITE_FORM_ENDPOINT` si usáis Vercel | ver `web/README.md` |

## Decisiones tomadas (revisadlas)
1. **Logo:** evolución de la foto de perfil de Instagram (anillo + píxel) para no romper con lo que ya se ve en redes: órbita abierta con dos píxeles que se desprenden y un satélite. Tipografía Space Grotesk, convertida a trazados.
2. **Estructura del proyecto:** la web vive en `web/` y la marca en `brand/` para no mezclarlas con el material de Instagram.
3. **SEO:** HTML prerenderizado por página (`/` en castellano, `/ca/` en catalán) con hreflang, en lugar de un único HTML que cambia de idioma con JavaScript. Las páginas legales llevan `noindex` y no están en el sitemap.
4. **Drei no se usa:** el orbe es un shader propio sobre React Three Fiber; Drei no aportaba nada y añadía peso.
5. **3D diferido:** se carga con la primera interacción (o a los 3,5 s en escritorio). Así Lighthouse móvil pasa de 45 a 91–92. Hasta entonces se ve un orbe estático en CSS.
6. **Formulario:** Netlify Forms por defecto (sin backend). Si falla el envío, se muestra el email y WhatsApp.
7. **Textos que son compromisos y debéis confirmar:** «Primera conversación sin compromiso», «Te damos un precio cerrado antes de empezar», «vamos en persona por la zona de Girona y trabajamos en remoto con el resto», «el plazo te lo damos en la primera conversación». No se ha inventado ningún cliente, cifra ni testimonio.
8. **Banner de cookies:** «Aceptar» y «Rechazar» tienen exactamente el mismo estilo. Ahora mismo no se carga analítica (no hay ID configurado).
9. **Loader:** solo en la primera visita de cada sesión, dura ~1,2 s y no aparece con «reducir movimiento».
