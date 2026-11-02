// Genera HTML estático para cada ruta (SEO + primer pintado rápido), sitemap.xml y robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, allRoutes, ROUTES, SITE } = await import(path.join(root, 'dist-ssr/entry-server.js'));
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// Precarga de las fuentes latinas (evita saltos de texto en el hero)
const assets = fs.readdirSync(path.join(dist, 'assets'));
const fontPreloads = assets
  .filter((f) => /^(space-grotesk|inter)-latin-wght-normal.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');

for (const url of allRoutes()) {
  const { html, head, lang } = render(url);
  const page = template
    .replace('<html lang="es"', `<html lang="${lang}"`)
    .replace('<!--app-head-->', `${fontPreloads}\n    ${head}`)
    .replace('<!--app-html-->', html);
  const out = path.join(dist, url, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
  console.log('✓', url);
}

// 404
{
  const { html, head } = render('/');
  fs.writeFileSync(path.join(dist, '404.html'), template.replace('<!--app-head-->', `${fontPreloads}\n    ${head}`).replace('<!--app-html-->', html));
}

const today = new Date().toISOString().slice(0, 10);
const homes = [ROUTES.es.home, ROUTES.ca.home];
const alt = `<xhtml:link rel="alternate" hreflang="es" href="${SITE.url}${ROUTES.es.home}"/><xhtml:link rel="alternate" hreflang="ca" href="${SITE.url}${ROUTES.ca.home}"/>`;
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${homes
    .map((u) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod>${alt}</url>`)
    .join('\n')}\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Prerender completo');
