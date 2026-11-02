// Genera todos los formatos del logo de ORBIXEL (SVG con texto convertido a trazados + PNG).
// Uso: npm run brand   (requiere Playwright/Chromium para los PNG)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '..');
const BRAND = path.resolve(WEB, '..', 'brand');
const PUBLIC = path.join(WEB, 'public');
const fontsDir = path.join(WEB, 'node_modules/@fontsource/space-grotesk/files');
const bold = opentype.parse(fs.readFileSync(path.join(fontsDir, 'space-grotesk-latin-700-normal.woff')).buffer);
const medium = opentype.parse(fs.readFileSync(path.join(fontsDir, 'space-grotesk-latin-500-normal.woff')).buffer);

export const C = { bg: '#05060A', violet: '#6C5CFF', cyan: '#22D3EE', white: '#F5F6FA', grey: '#A3A8BD', ink: '#05060A' };

// ---------- Texto a trazados ----------
function textPath(font, text, x, baseline, size, trackingEm = 0) {
  const scale = size / font.unitsPerEm;
  let cx = x; let d = '';
  const glyphs = font.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, baseline, size).toPathData(2);
    let adv = g.advanceWidth * scale + trackingEm * size;
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale;
    cx += adv;
  });
  return { d, width: cx - x - trackingEm * size };
}

// ---------- Símbolo ----------
// «O» formada por una órbita abierta; en el hueco, la órbita se descompone en píxeles
// y un píxel mayor hace de satélite. Rejilla 64×64, centro 32/32, radio 22, trazo 8.
const R = 22, CX = 32, CY = 32;
const pt = (deg, r = R) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)];
const f = (n) => +n.toFixed(2);
const [ax, ay] = pt(86); const [bx, by] = pt(22);
export const ARC = `M${f(ax)} ${f(ay)}A${R} ${R} 0 1 1 ${f(bx)} ${f(by)}`;
const sq = (deg, s, r = R) => { const [x, y] = pt(deg, r); return { x: f(x - s / 2), y: f(y - s / 2), s }; };
export const PIXELS = [sq(30.5, 4.6), sq(36.5, 2.8, 29.5)]; // píxeles que se desprenden de la órbita
export const SAT = sq(59, 11.5);                    // satélite

function symbolInner({ mode = 'color', id = 'o' } = {}) {
  const ring = mode === 'color' ? `url(#${id}g)` : mode === 'light' ? C.white : C.ink;
  const sat = mode === 'color' ? C.white : ring;
  const px = mode === 'color' ? C.cyan : ring;
  const defs = mode === 'color'
    ? `<defs><linearGradient id="${id}g" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse"><stop stop-color="${C.violet}"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient></defs>`
    : '';
  return `${defs}<path d="${ARC}" fill="none" stroke="${ring}" stroke-width="8"/>` +
    PIXELS.map((p) => `<rect x="${p.x}" y="${p.y}" width="${p.s}" height="${p.s}" rx="${f(p.s * 0.18)}" fill="${px}"/>`).join('') +
    `<rect x="${SAT.x}" y="${SAT.y}" width="${SAT.s}" height="${SAT.s}" rx="2.6" fill="${sat}"/>`;
}

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t"><title id="t">${title}</title>${body}</svg>\n`;

function symbol(mode) { return svg(64, 64, symbolInner({ mode }), 'ORBIXEL'); }

function horizontal(mode) {
  // Símbolo 64 de alto; wordmark con altura de mayúscula ≈ 30 (≈ 47% del símbolo)
  const size = 42; const baseline = 47;
  const word = textPath(bold, 'ORBIXEL', 80, baseline, size, 0.02);
  const agencyX = 80 + word.width + 10;
  const agency = textPath(medium, 'Agency', agencyX, baseline, 25, 0);
  const w = Math.ceil(agencyX + agency.width + 2);
  const fg = mode === 'dark' ? C.ink : C.white;
  const sub = mode === 'color' ? C.grey : fg;
  const body = `<g>${symbolInner({ mode, id: 'h' })}</g><path d="${word.d}" fill="${fg}"/><path d="${agency.d}" fill="${sub}"${mode === 'color' ? '' : ' opacity=".72"'}/>`;
  return svg(w, 64, body, 'ORBIXEL Agency');
}

function favicon() {
  // Fondo redondeado para que se vea en pestañas claras y oscuras
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${C.bg}"/><g transform="translate(5 5) scale(.84375)">${symbolInner({ mode: 'color', id: 'f' })}</g></svg>\n`;
}

const files = {
  'logo/orbixel-isotipo.svg': symbol('color'),
  'logo/orbixel-isotipo-mono-claro.svg': symbol('light'),
  'logo/orbixel-isotipo-mono-oscuro.svg': symbol('dark'),
  'logo/orbixel-logo-horizontal.svg': horizontal('color'),
  'logo/orbixel-logo-horizontal-mono-claro.svg': horizontal('light'),
  'logo/orbixel-logo-horizontal-mono-oscuro.svg': horizontal('dark'),
  'favicon/favicon.svg': favicon(),
};
for (const [rel, content] of Object.entries(files)) {
  const out = path.join(BRAND, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}
fs.mkdirSync(path.join(PUBLIC, 'brand'), { recursive: true });
fs.copyFileSync(path.join(BRAND, 'favicon/favicon.svg'), path.join(PUBLIC, 'favicon.svg'));
for (const n of ['orbixel-isotipo.svg', 'orbixel-logo-horizontal.svg', 'orbixel-logo-horizontal-mono-claro.svg']) {
  fs.copyFileSync(path.join(BRAND, 'logo', n), path.join(PUBLIC, 'brand', n));
}
// Datos geométricos para los componentes React (logo animado)
{
  const word = textPath(bold, 'ORBIXEL', 80, 47, 42, 0.02);
  const agencyX = 80 + word.width + 10;
  const agency = textPath(medium, 'Agency', agencyX, 47, 25, 0);
  fs.writeFileSync(path.join(WEB, 'src/components/brand/logoGeometry.ts'),
    `// Generado por scripts/build-brand.mjs — no editar a mano\nexport const ARC = ${JSON.stringify(ARC)};\nexport const PIXELS = ${JSON.stringify(PIXELS)};\nexport const SAT = ${JSON.stringify(SAT)};\nexport const WORD_D = ${JSON.stringify(word.d)};\nexport const AGENCY_D = ${JSON.stringify(agency.d)};\nexport const LOGO_W = ${Math.ceil(agencyX + agency.width + 2)};\n`);
}

// ---------- PNG (favicon, apple-touch, isotipo) ----------
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || '', '/usr/local/lib/node_modules', '/usr/lib/node_modules'] }))); }
const browser = await chromium.launch();
const page = await browser.newPage();
async function png(svgStr, size, out, bg = 'transparent') {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:${bg}"><div style="width:${size}px;height:${size}px">${svgStr.replace('<svg ', `<svg style="width:${size}px;height:${size}px;display:block" `)}</div></body></html>`);
  await page.screenshot({ path: out, omitBackground: bg === 'transparent' });
}
const fav = favicon();
await png(fav, 32, path.join(BRAND, 'favicon/favicon-32.png'));
await png(fav, 180, path.join(BRAND, 'favicon/apple-touch-icon-180.png'));
await png(fav, 512, path.join(BRAND, 'favicon/icon-512.png'));
await png(symbol('color'), 1024, path.join(BRAND, 'logo/orbixel-isotipo-1024.png'));
fs.copyFileSync(path.join(BRAND, 'favicon/favicon-32.png'), path.join(PUBLIC, 'favicon-32.png'));
fs.copyFileSync(path.join(BRAND, 'favicon/apple-touch-icon-180.png'), path.join(PUBLIC, 'apple-touch-icon.png'));
fs.copyFileSync(path.join(BRAND, 'favicon/icon-512.png'), path.join(PUBLIC, 'icon-512.png'));

// Horizontal en PNG (fondo oscuro y claro) para usos rápidos
async function pngWide(svgStr, h, out, bg) {
  const m = svgStr.match(/viewBox="0 0 (\d+) 64"/); const w = Math.round((+m[1] / 64) * h);
  const pad = Math.round(h * 0.5);
  await page.setViewportSize({ width: w + pad * 2, height: h + pad * 2 });
  await page.setContent(`<html><body style="margin:0;background:${bg};padding:${pad}px">${svgStr.replace('<svg ', `<svg style="width:${w}px;height:${h}px;display:block" `)}</body></html>`);
  await page.screenshot({ path: out });
}
await pngWide(horizontal('color'), 160, path.join(BRAND, 'logo/orbixel-logo-horizontal-fondo-oscuro.png'), C.bg);
await pngWide(horizontal('dark'), 160, path.join(BRAND, 'logo/orbixel-logo-horizontal-fondo-claro.png'), '#FFFFFF');

// ---------- Imagen Open Graph 1200×630 ----------
const ogFont = fs.readFileSync(path.join(fontsDir, 'space-grotesk-latin-700-normal.woff2')).toString('base64');
const ogFontM = fs.readFileSync(path.join(fontsDir, 'space-grotesk-latin-500-normal.woff2')).toString('base64');
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<html><head><style>
@font-face{font-family:SG;font-weight:700;src:url(data:font/woff2;base64,${ogFont}) format('woff2')}
@font-face{font-family:SG;font-weight:500;src:url(data:font/woff2;base64,${ogFontM}) format('woff2')}
body{margin:0;width:1200px;height:630px;background:${C.bg};font-family:SG;color:${C.white};overflow:hidden;position:relative}
.glow{position:absolute;width:760px;height:760px;right:-160px;top:-120px;border-radius:50%;background:radial-gradient(circle,rgba(108,92,255,.42),rgba(34,211,238,.10) 45%,transparent 70%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:40px 40px;mask-image:radial-gradient(circle at 75% 40%,#000,transparent 70%)}
.mark{position:absolute;right:90px;top:120px;width:390px;height:390px;filter:drop-shadow(0 0 40px rgba(108,92,255,.55))}
.logo{position:absolute;left:80px;top:70px;height:56px}
h1{position:absolute;left:80px;top:215px;margin:0;font-size:70px;line-height:1.02;letter-spacing:-.03em;width:640px;font-weight:700}
p{position:absolute;left:80px;bottom:72px;margin:0;font-size:26px;color:#C9CCDB;font-weight:500;width:620px;line-height:1.35}
h1 span{background:linear-gradient(90deg,${C.violet},${C.cyan});-webkit-background-clip:text;color:transparent}
</style></head><body><div class="glow"></div><div class="grid"></div>
<div class="mark">${symbol('color').replace('<svg ', '<svg style="width:100%;height:100%" ')}</div>
<div class="logo">${horizontal('color').replace('<svg ', '<svg style="height:56px;width:auto" ')}</div>
<h1>Tu negocio funciona. <span>Hagamos que funcione solo.</span></h1>
<p>Agencia de IA y automatización · Santa Coloma de Farners (Girona)</p>
</body></html>`);
await page.screenshot({ path: path.join(PUBLIC, 'og-image.png') });
fs.copyFileSync(path.join(PUBLIC, 'og-image.png'), path.join(BRAND, 'og-image-1200x630.png'));
await browser.close();
console.log('Marca generada en', BRAND);
