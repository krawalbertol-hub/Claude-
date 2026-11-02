# Web de ORBIXEL Agency

Vite + React 19 + TypeScript + Tailwind CSS 4 + React Three Fiber (Three.js) + GSAP/ScrollTrigger + Lenis.
Castellano (`/`) y catalán (`/ca/`), HTML prerenderizado para SEO y carga rápida.

## Ejecutar en local
```bash
cd web
npm install
npm run dev        # http://localhost:5173 (sin prerender)
npm run build      # genera dist/ con HTML estático por página, sitemap.xml y robots.txt
npm run preview    # sirve dist/ en http://localhost:4173
npm run brand      # regenera el logo, favicons e imagen Open Graph (requiere Playwright)
```
Node 20 o superior.

## Desplegar
**Netlify** (recomendado: el formulario funciona sin configurar nada con Netlify Forms)
1. Sube el repositorio a GitHub y en Netlify «Add new site → Import from Git».
2. El `netlify.toml` de la raíz ya indica `base = web`, el comando y la carpeta `dist`.
3. Tras el primer despliegue: *Forms → contacto* para ver los envíos y activar avisos por email
   a contact.orbixel@gmail.com (*Forms → Form notifications*).
4. *Domain management* → añade el dominio y actualiza `SITE.url` en `src/config/site.ts`.

**Vercel**
1. «Add New Project» → importa el repo → *Root Directory*: `web`. Framework: Vite (usa `vercel.json`).
2. Vercel no procesa formularios: crea un formulario en Formspree (u otro servicio) y añade la
   variable de entorno `VITE_FORM_ENDPOINT=https://formspree.io/f/xxxx` en el proyecto.

## Dónde se cambia cada cosa
| Qué | Archivo |
|---|---|
| Dominio, teléfono, WhatsApp, redes, precio del diagnóstico, ID de analítica | `src/config/site.ts` |
| Textos en castellano / catalán | `src/i18n/es.ts` · `src/i18n/ca.ts` |
| Textos legales | `src/i18n/legal.ts` |
| Casos reales | `src/components/sections/Cases.tsx` (array `CASES`) |
| Colores, tipografías, radios | `@theme` en `src/styles/index.css` |
| Guion del orbe 3D por sección | `src/lib/motion.ts` (`frames`) |
| Shader del orbe | `src/components/three/OrbCanvas.tsx` |

## Estructura
```
src/
  App.tsx                 rutas (/, /ca/, legales) y orquestación
  entry-server.tsx        render para el prerender (scripts/prerender.mjs)
  seo.ts                  title, meta, hreflang, Open Graph, JSON-LD (LocalBusiness + FAQPage)
  config/site.ts          datos del negocio
  i18n/                   es.ts, ca.ts, legal.ts
  lib/                    motion (GSAP+Lenis), orbState, consent (cookies), scroll, env
  components/
    brand/                Logo (isotipo y horizontal, geometría generada)
    layout/               Header, Footer, Cursor, CookieBanner
    sections/             Hero, Problem, Approach, Diagnosis, Implementation, Process,
                          Sectors, WhyUs, Cases, FAQ, ContactForm
    three/                OrbLayer (carga diferida y respaldo), OrbCanvas (R3F + shader)
    ui/                   CtaButton (magnético), Card (tilt), SplitText, Icon, hooks
```

## Rendimiento y accesibilidad
- El 3D se carga con la primera interacción (o a los 3,5 s en escritorio) en un chunk aparte;
  hasta entonces se ve un orbe CSS. Sin WebGL o con «reducir movimiento» se queda el orbe estático
  y no se inicializan ni Lenis ni GSAP.
- Móvil: 4 500 partículas (12 000 en escritorio, 7 000 en equipos de ≤4 núcleos), sin cursor personalizado.
- La analítica (GA4) solo se inyecta tras pulsar «Aceptar» en el banner de cookies.
- Lighthouse (build local, Chrome headless): móvil 91–92 rendimiento · 100 accesibilidad · 100 buenas prácticas · 100 SEO;
  escritorio 100 · 100 · 100 · 100.

## GitHub Pages
La carpeta `docs/` de la raíz contiene la web ya compilada para `https://krawalbertol-hub.github.io/Claude-/`.
En GitHub: *Settings → Pages → Build and deployment → Source: Deploy from a branch*, rama
`claude/laughing-carson-tkoiy3` (o la rama donde esté) y carpeta `/docs` → *Save*.
Después de cambiar algo, regenera `docs/` con `cd web && npm run build:pages` y haz commit.
En GitHub Pages no funciona Netlify Forms: crea un formulario en Formspree, pon su URL en
`VITE_FORM_ENDPOINT` (archivo `web/.env`) y vuelve a ejecutar `npm run build:pages`.
Mientras tanto, si el envío falla, la web muestra el email y el WhatsApp.
