// Renderiza los carruseles de Instagram (1080x1350) a PNG con Playwright.
// Uso: node instagram/tools/render-carousels.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'imagenes');
const HANDLE = '@orbixel.agency';

const CSS = `
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1080px; height:1350px; }
body {
  font-family: 'Inter', sans-serif; color:#F4F4FB; overflow:hidden; position:relative;
  background:#0A0A18;
}
.bg::before, .bg::after { content:''; position:absolute; border-radius:50%; filter:blur(120px); opacity:.55; }
.bg::before { width:700px; height:700px; background:#7C3AED; top:-220px; right:-240px; }
.bg::after  { width:600px; height:600px; background:#06B6D4; bottom:-260px; left:-220px; opacity:.4; }
.grid { position:absolute; inset:0; opacity:.07;
  background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px);
  background-size: 60px 60px; }
.wrap { position:absolute; inset:0; padding:96px 90px; display:flex; flex-direction:column; }
.top { display:flex; justify-content:space-between; align-items:center; font-size:26px; font-weight:600; letter-spacing:.04em; }
.brand { display:flex; align-items:center; gap:14px; }
.dot { width:22px; height:22px; border-radius:50%; background:linear-gradient(135deg,#A78BFA,#22D3EE); box-shadow:0 0 24px #8B5CF6; }
.count { color:#A5A5C8; font-weight:500; }
.main { flex:1; display:flex; flex-direction:column; justify-content:center; }
.tag { display:inline-block; align-self:flex-start; padding:12px 26px; border-radius:999px; font-size:26px; font-weight:700;
  letter-spacing:.08em; text-transform:uppercase; border:2px solid rgba(167,139,250,.6); color:#C4B5FD; background:rgba(124,58,237,.12); margin-bottom:44px; }
h1 { font-family:'Inter Display','Inter',sans-serif; font-weight:800; font-size:104px; line-height:1.02; letter-spacing:-.03em; }
h2 { font-family:'Inter Display','Inter',sans-serif; font-weight:800; font-size:80px; line-height:1.05; letter-spacing:-.025em; }
.grad { background:linear-gradient(90deg,#A78BFA,#22D3EE); -webkit-background-clip:text; background-clip:text; color:transparent; }
.sub { margin-top:44px; font-size:40px; line-height:1.35; color:#C9C9E3; font-weight:500; max-width:860px; }
.num { font-family:'Inter Display','Inter',sans-serif; font-size:220px; font-weight:900; line-height:.9; letter-spacing:-.05em; margin-bottom:30px;
  background:linear-gradient(180deg,#A78BFA,rgba(34,211,238,.35)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.body { margin-top:40px; font-size:42px; line-height:1.4; color:#D4D4EC; font-weight:400; max-width:880px; }
.body b { color:#fff; font-weight:700; }
.card { border-radius:36px; padding:44px 48px; margin-bottom:34px; }
.myth { background:rgba(244,63,94,.08); border:2px solid rgba(244,63,94,.45); }
.real { background:rgba(34,211,238,.08); border:2px solid rgba(34,211,238,.5); }
.label { font-size:26px; font-weight:800; letter-spacing:.12em; margin-bottom:18px; display:flex; align-items:center; gap:14px; }
.myth .label { color:#FB7185; } .real .label { color:#67E8F9; }
.ico { width:44px; height:44px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; color:#0A0A18; }
.myth .ico { background:#FB7185; } .real .ico { background:#67E8F9; }
.card p { font-size:46px; line-height:1.3; font-weight:600; }
.myth p { color:#E9E9F5; text-decoration: line-through; text-decoration-color: rgba(251,113,133,.7); text-decoration-thickness:3px; }
.bottom { display:flex; justify-content:space-between; align-items:center; font-size:28px; color:#A5A5C8; font-weight:500; }
.swipe { display:flex; align-items:center; gap:14px; color:#fff; font-weight:700; }
.arrow { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#7C3AED,#06B6D4); display:flex; align-items:center; justify-content:center; font-size:34px; }
.bar { height:6px; border-radius:6px; background:rgba(255,255,255,.12); width:300px; overflow:hidden; }
.bar i { display:block; height:100%; background:linear-gradient(90deg,#A78BFA,#22D3EE); }
.cta { margin-top:56px; display:flex; flex-direction:column; gap:22px; }
.pill { display:flex; align-items:center; gap:22px; padding:28px 36px; border-radius:28px; background:rgba(255,255,255,.06); border:2px solid rgba(255,255,255,.12); font-size:38px; font-weight:600; }
.pill .k { width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg,#7C3AED,#06B6D4); display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:800; flex-shrink:0; }
.follow { margin-top:20px; padding:34px; border-radius:28px; text-align:center; font-size:44px; font-weight:800; background:linear-gradient(90deg,#7C3AED,#06B6D4); color:#fff; }
.kw { display:inline-block; padding:4px 22px; border-radius:14px; background:#fff; color:#0A0A18; font-weight:900; }
`;

function frame({ i, n, inner, swipe = true }) {
  const progress = Math.round((i / n) * 100);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body><div class="bg"></div><div class="grid"></div><div class="wrap">
  <div class="top"><div class="brand"><span class="dot"></span>ORBIXEL</div><div class="count">${String(i).padStart(2,'0')} / ${String(n).padStart(2,'0')}</div></div>
  <div class="main">${inner}</div>
  <div class="bottom"><span>${HANDLE}</span>${
    swipe && i < n ? `<span class="swipe">Desliza <span class="arrow">→</span></span>` : `<span class="bar"><i style="width:${progress}%"></i></span>`
  }</div>
</div></body></html>`;
}

const carrusel1 = [
  `<span class="tag">IA para negocios</span>
   <h1>5 tareas que tu negocio puede <span class="grad">automatizar con IA</span> esta semana</h1>
   <p class="sub">Y recuperar horas cada mes. Sin saber programar.</p>`,
  ...[
    ['Responder preguntas frecuentes', 'Un asistente de IA en <b>WhatsApp o en tu web</b> contesta al momento, a cualquier hora. Tus clientes nunca esperan.'],
    ['Agendar citas', 'La IA consulta tu calendario, <b>propone huecos y confirma</b> la cita sin que toques nada.'],
    ['Escribir emails y propuestas', 'De la hoja en blanco a un <b>borrador personalizado</b> en segundos. Tú solo revisas y envías.'],
    ['Clasificar leads', 'La IA detecta <b>quién está listo para comprar</b> y te avisa primero de esos contactos.'],
    ['Crear informes', 'Tus datos de ventas, convertidos en un <b>resumen claro cada lunes</b>. Automáticamente.'],
  ].map(([t, b], k) => `<div class="num">0${k + 1}</div><h2>${t}</h2><p class="body">${b}</p>`),
  `<span class="tag">Tu turno</span>
   <h1>¿Cuál <span class="grad">implementarías</span> primero?</h1>
   <div class="cta">
     <div class="pill"><span class="k">1</span>Guárdalo para no perderlo</div>
     <div class="pill"><span class="k">2</span>Cuéntanos en comentarios</div>
     <div class="follow">Síguenos en ${HANDLE}</div>
   </div>`,
];

const mitos = [
  ['“La IA es solo para grandes empresas.”', 'Hoy cualquier pyme puede usarla con soluciones a medida y asequibles.'],
  ['“La IA va a sustituir a mi equipo.”', 'Se ocupa de lo repetitivo para que tu equipo se centre en lo que aporta valor.'],
  ['“Hay que saber programar.”', 'Nosotros lo montamos. Tú solo lo usas.'],
  ['“Implementarla tarda meses.”', 'Muchas automatizaciones se ponen en marcha en pocos días.'],
];
const carrusel3 = [
  `<span class="tag">Mitos vs realidad</span>
   <h1>4 mitos sobre la IA que están <span class="grad">frenando tu negocio</span></h1>
   <p class="sub">¿Cuántos te has creído? Desliza y descúbrelo.</p>`,
  ...mitos.map(([m, r], k) => `
   <div class="num" style="font-size:150px">0${k + 1}</div>
   <div class="card myth"><div class="label"><span class="ico">✕</span>MITO</div><p>${m}</p></div>
   <div class="card real"><div class="label"><span class="ico">✓</span>REALIDAD</div><p>${r}</p></div>`),
  `<span class="tag">Guía gratuita</span>
   <h1>¿Quieres empezar con <span class="grad">IA</span> en tu negocio?</h1>
   <div class="cta">
     <div class="pill" style="display:block;font-size:42px;line-height:1.5">Comenta <span class="kw">GUÍA</span> y te la enviamos gratis por DM</div>
     <div class="pill"><span class="k">↻</span>Compártelo con quien lo necesite</div>
     <div class="follow">Síguenos en ${HANDLE}</div>
   </div>`,
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [name, slides] of [['carrusel-1-tareas-ia', carrusel1], ['carrusel-3-mitos-ia', carrusel3]]) {
    const dir = path.join(OUT, name);
    fs.mkdirSync(dir, { recursive: true });
    for (let k = 0; k < slides.length; k++) {
      await page.setContent(frame({ i: k + 1, n: slides.length, inner: slides[k] }), { waitUntil: 'load' });
      await page.screenshot({ path: path.join(dir, `${String(k + 1).padStart(2, '0')}.png`) });
    }
    console.log(name, slides.length, 'slides');
  }
  // Portada del reel (9:16). El contenido clave va centrado para que se vea bien
  // también recortado en la cuadrícula del perfil (3:4).
  const reel = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const reelHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
    html, body { height:1920px; }
    .wrap { padding:0 90px; justify-content:center; }
    .phone { align-self:center; width:640px; padding:34px 36px; border-radius:40px; background:rgba(255,255,255,.07);
      border:2px solid rgba(255,255,255,.14); box-shadow:0 30px 80px rgba(0,0,0,.45); margin-bottom:70px; }
    .ph-top { display:flex; justify-content:space-between; font-size:26px; color:#A5A5C8; margin-bottom:24px; }
    .ph-time { font-size:96px; font-weight:800; font-family:'Inter Display','Inter',sans-serif; color:#fff; letter-spacing:-.03em; text-align:center; margin-bottom:26px; }
    .msg { display:flex; gap:20px; align-items:center; padding:22px 24px; border-radius:24px; background:rgba(10,10,24,.6); }
    .av { width:64px; height:64px; border-radius:50%; background:#22C55E; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:28px; color:#0A0A18; }
    .msg b { display:block; font-size:28px; color:#fff; } .msg span { font-size:26px; color:#C9C9E3; }
    .reply { margin-top:14px; margin-left:84px; padding:18px 22px; border-radius:22px; font-size:26px; font-weight:600;
      background:linear-gradient(90deg,#7C3AED,#06B6D4); color:#fff; }
    h1 { text-align:center; font-size:118px; }
    .sub { text-align:center; align-self:center; }
    .hbrand { position:absolute; left:0; right:0; bottom:150px; text-align:center; font-size:30px; color:#A5A5C8; font-weight:500; }
    .hbrand .brand { justify-content:center; color:#fff; font-weight:600; letter-spacing:.04em; margin-bottom:12px; }
  </style></head><body><div class="bg"></div><div class="grid"></div><div class="wrap">
    <div class="phone">
      <div class="ph-top"><span>WhatsApp</span><span>ahora</span></div>
      <div class="ph-time">23:47</div>
      <div class="msg"><div class="av">C</div><div><b>Cliente nuevo</b><span>Hola, ¿tenéis cita para mañana?</span></div></div>
      <div class="reply">¡Hola! Sí, a las 10:00 o a las 12:30. ¿Cuál prefieres?</div>
    </div>
    <h1>Tu negocio, <span class="grad">abierto 24/7</span></h1>
    <p class="sub">Un asistente de IA que responde, resuelve y agenda mientras duermes.</p>
  </div>
  <div class="hbrand"><div class="brand"><span class="dot"></span>ORBIXEL</div>${HANDLE}</div>
  </body></html>`;
  await reel.setContent(reelHtml, { waitUntil: 'load' });
  fs.mkdirSync(path.join(OUT, 'reel-2-asistente-24-7'), { recursive: true });
  await reel.screenshot({ path: path.join(OUT, 'reel-2-asistente-24-7', 'portada.png') });
  console.log('reel cover');
  await browser.close();
})();
