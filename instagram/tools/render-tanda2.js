// Tanda 2: 9 publicaciones nuevas + foto de perfil + portadas de historias destacadas.
// Estilo del principio (fondo oscuro, violeta, cian y blanco), en versión más limpia.
// Uso: node instagram/tools/render-tanda2.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'tanda-2');
const HANDLE = '@orbixel.agency';

const CSS = `
:root { --bg:#0A0A18; --fg:#F4F4FB; --muted:#A5A5C8; --soft:#D4D4EC; --violet:#7C3AED; --violet-l:#A78BFA; --cyan:#06B6D4; --cyan-l:#22D3EE; --line:rgba(255,255,255,.12); }
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1080px; height:1350px; }
body { font-family:'Inter',sans-serif; color:var(--fg); background:var(--bg); overflow:hidden; position:relative; }
.bg::before, .bg::after { content:''; position:absolute; border-radius:50%; filter:blur(130px); }
.bg::before { width:640px; height:640px; background:var(--violet); top:-260px; right:-260px; opacity:.45; }
.bg::after  { width:560px; height:560px; background:var(--cyan); bottom:-280px; left:-240px; opacity:.28; }
.grid { position:absolute; inset:0; opacity:.05;
  background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size:60px 60px; }
.wrap { position:absolute; inset:0; padding:92px 90px; display:flex; flex-direction:column; }
.top { display:flex; justify-content:space-between; align-items:center; font-size:24px; font-weight:600; letter-spacing:.08em; }
.brand { display:flex; align-items:center; gap:14px; }
.dot { width:20px; height:20px; border-radius:50%; background:linear-gradient(135deg,var(--violet-l),var(--cyan-l)); box-shadow:0 0 22px var(--violet); }
.count { color:var(--muted); font-weight:500; letter-spacing:.04em; font-variant-numeric:tabular-nums; }
.main { flex:1; display:flex; flex-direction:column; justify-content:center; gap:0; }
.tag { align-self:flex-start; padding:11px 24px; border-radius:999px; font-size:24px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
  border:1.5px solid rgba(167,139,250,.55); color:#C4B5FD; background:rgba(124,58,237,.12); margin-bottom:40px; }
h1 { font-family:'Inter Display','Inter',sans-serif; font-weight:800; font-size:100px; line-height:1.03; letter-spacing:-.03em; text-wrap:balance; }
h2 { font-family:'Inter Display','Inter',sans-serif; font-weight:800; font-size:74px; line-height:1.06; letter-spacing:-.025em; text-wrap:balance; }
.grad { background:linear-gradient(90deg,var(--violet-l),var(--cyan-l)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.sub { margin-top:40px; font-size:38px; line-height:1.4; color:#C9C9E3; font-weight:500; max-width:860px; }
.label { font-size:24px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--cyan-l); margin-bottom:26px; }
.body { margin-top:36px; font-size:40px; line-height:1.42; color:var(--soft); max-width:880px; }
.body b { color:#fff; font-weight:700; }
.bottom { display:flex; justify-content:space-between; align-items:center; font-size:26px; color:var(--muted); font-weight:500; }
.swipe { display:flex; align-items:center; gap:14px; color:#fff; font-weight:700; }
.arrow { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,var(--violet),var(--cyan)); display:flex; align-items:center; justify-content:center; font-size:32px; }
.bar { height:6px; border-radius:6px; background:rgba(255,255,255,.12); width:280px; overflow:hidden; }
.bar i { display:block; height:100%; background:linear-gradient(90deg,var(--violet-l),var(--cyan-l)); }
.panel { border-radius:32px; background:rgba(255,255,255,.05); border:1.5px solid var(--line); }
.rows { display:flex; flex-direction:column; gap:22px; margin-top:48px; }
.row { display:flex; align-items:center; gap:26px; padding:30px 34px; border-radius:26px; background:rgba(255,255,255,.05); border:1.5px solid var(--line); font-size:36px; font-weight:600; line-height:1.3; }
.k { width:58px; height:58px; border-radius:16px; flex-shrink:0; background:linear-gradient(135deg,var(--violet),var(--cyan)); display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; }
.follow { margin-top:12px; padding:32px; border-radius:26px; text-align:center; font-size:42px; font-weight:800; background:linear-gradient(90deg,var(--violet),var(--cyan)); }
.kw { display:inline-block; padding:2px 20px; border-radius:12px; background:#fff; color:var(--bg); font-weight:900; }
.cmp { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:44px; }
.cmp .h { font-size:24px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; padding:0 6px 4px; }
.cmp .h.a { color:var(--muted); } .cmp .h.b { color:var(--cyan-l); }
.cmp .c { padding:28px 30px; border-radius:24px; font-size:32px; line-height:1.32; font-weight:600; min-height:150px; display:flex; align-items:center; }
.cmp .c.a { background:rgba(255,255,255,.04); border:1.5px solid var(--line); color:#B9B9D6; }
.cmp .c.b { background:linear-gradient(135deg,rgba(124,58,237,.28),rgba(6,182,212,.2)); border:1.5px solid rgba(34,211,238,.45); }
.prompt { margin-top:44px; padding:44px 46px; border-radius:30px; background:rgba(10,10,24,.6); border:1.5px solid rgba(167,139,250,.5); font-family:'DejaVu Sans Mono',monospace; font-size:32px; line-height:1.5; color:#E9E6FF; }
.prompt .hl { color:var(--cyan-l); }
.tip { margin-top:30px; font-size:30px; line-height:1.45; color:var(--muted); }
.tip b { color:#fff; }
.big { font-family:'Inter Display','Inter',sans-serif; font-weight:900; font-size:250px; line-height:.9; letter-spacing:-.05em; }
.opts { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:52px; }
.opt { padding:28px 32px; border-radius:26px; background:rgba(255,255,255,.05); border:1.5px solid var(--line); font-size:34px; font-weight:600; line-height:1.3; }
.opt b { display:block; font-size:56px; font-weight:900; margin-bottom:10px; }
.calc { display:flex; flex-direction:column; gap:16px; margin-top:44px; }
.calc .ln { display:flex; justify-content:space-between; align-items:baseline; padding:24px 32px; border-radius:22px; background:rgba(255,255,255,.05); border:1.5px solid var(--line); font-size:34px; color:var(--soft); font-variant-numeric:tabular-nums; }
.calc .ln b { color:#fff; font-size:44px; font-weight:800; }
.calc .tot { background:linear-gradient(90deg,rgba(124,58,237,.35),rgba(6,182,212,.25)); border-color:rgba(34,211,238,.5); }
.term { font-size:24px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--violet-l); margin-bottom:22px; }
`;

function frame({ i, n, inner, single = false }) {
  const counter = single ? '' : `<div class="count">${String(i).padStart(2, '0')} / ${String(n).padStart(2, '0')}</div>`;
  const right = single ? `<span>Orbixel · Agencia de IA</span>`
    : i < n ? `<span class="swipe">Desliza <span class="arrow">→</span></span>`
    : `<span class="bar"><i style="width:100%"></i></span>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body><div class="bg"></div><div class="grid"></div><div class="wrap">
  <div class="top"><div class="brand"><span class="dot"></span>ORBIXEL</div>${counter}</div>
  <div class="main">${inner}</div>
  <div class="bottom"><span>${HANDLE}</span>${right}</div>
</div></body></html>`;
}

const cover = (tag, title, sub) => `<span class="tag">${tag}</span><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}`;
const point = (label, title, body) => `<div class="label">${label}</div><h2>${title}</h2><p class="body">${body}</p>`;
const cta = (title, rows, follow = `Síguenos en ${HANDLE}`) =>
  `<h2>${title}</h2><div class="rows">${rows.map((r, k) => `<div class="row"><span class="k">${k + 1}</span><span>${r}</span></div>`).join('')}<div class="follow">${follow}</div></div>`;

const POSTS = [
  {
    id: '01-senales-necesitas-ia', slides: [
      cover('Checklist', '5 señales de que tu negocio <span class="grad">necesita IA</span>', '¿Cuántas cumples? Si son 2 o más, sigue leyendo.'),
      point('Señal 1 de 5', 'Respondes las mismas preguntas cada día', 'Horarios, precios, disponibilidad… Si tu equipo repite respuestas, <b>un asistente de IA puede darlas por vosotros</b>.'),
      point('Señal 2 de 5', 'Pierdes clientes por responder tarde', 'Quien escribe y no recibe respuesta <b>suele irse a otro sitio</b>. La IA contesta al momento, también de noche.'),
      point('Señal 3 de 5', 'Copias datos de un sitio a otro', 'Formularios, hojas de cálculo, CRM… <b>Ese copiar y pegar se puede automatizar</b>.'),
      point('Señal 4 de 5', 'Tu agenda la gestionas a mano', 'Llamadas y mensajes para cuadrar citas. <b>La IA puede proponer huecos y confirmar</b> sola.'),
      point('Señal 5 de 5', 'No tienes tiempo para crecer', 'Si lo urgente se come lo importante, <b>delegar lo repetitivo en la IA</b> te devuelve ese tiempo.'),
      cta('¿Cuántas señales <span class="grad">cumples</span>?', ['Dínoslo en comentarios', 'Guárdalo para revisarlo con tu equipo']),
    ],
  },
  {
    id: '02-tu-competencia', single: true, slides: [
      `<span class="tag">Piénsalo</span>
       <h1 style="font-size:116px">Mientras lees esto, alguien de tu sector ya está <span class="grad">usando IA</span>.</h1>
       <p class="sub">La pregunta no es si la IA llegará a tu negocio. Es si llegarás tú primero.</p>`,
    ],
  },
  {
    id: '03-antes-despues', slides: [
      cover('Antes vs ahora', 'Tu negocio <span class="grad">sin IA</span> y con IA', 'Las mismas tareas, otra forma de hacerlas.'),
      ...[
        ['Atención al cliente', 'Respondes cuando puedes, aunque pasen horas', 'Respuesta al momento, 24/7, con tu tono'],
        ['Citas y reservas', 'Llamadas y mensajes para cuadrar huecos', 'El cliente reserva solo y recibe recordatorio'],
        ['Seguimiento de leads', 'Contactos que se quedan sin respuesta', 'Mensajes de seguimiento automáticos'],
        ['Informes', 'Horas montando hojas de cálculo', 'Resumen listo cada lunes, sin tocar nada'],
      ].map(([t, a, b]) => `<h2>${t}</h2><div class="cmp">
          <div class="h a">Sin IA</div><div class="h b">Con IA</div>
          <div class="c a">${a}</div><div class="c b">${b}</div></div>`),
      cta('¿Qué parte de tu negocio <span class="grad">cambiarías</span> primero?', ['Cuéntanoslo en comentarios', 'Escríbenos <span class="kw">DEMO</span> por DM']),
    ],
  },
  {
    id: '04-prompts-negocio', slides: [
      cover('Copia y pega', '4 prompts que te ahorran <span class="grad">horas cada semana</span>', 'Funcionan en ChatGPT, Claude o Gemini. Cambia lo que está entre [corchetes].'),
      ...[
        ['Responder a clientes', 'Actúa como el equipo de atención de <span class="hl">[negocio]</span>. Responde de forma amable y breve: <span class="hl">[pregunta del cliente]</span>.', 'Pega también tus horarios y precios para que acierte.'],
        ['Email comercial', 'Escribe un email corto para <span class="hl">[tipo de cliente]</span> presentando <span class="hl">[servicio]</span>. Un beneficio claro y una llamada a la acción.', 'Pídele 3 versiones y quédate con la mejor.'],
        ['Resumen de reunión', 'Resume estas notas en decisiones, tareas con responsable y próximos pasos: <span class="hl">[notas]</span>.', 'Ideal justo al terminar la reunión.'],
        ['Contenido para redes', 'Dame 5 ideas de posts para <span class="hl">[negocio]</span> que aporten valor a <span class="hl">[público]</span> y acaben con una pregunta.', 'Después pídele que desarrolle la que más te guste.'],
      ].map(([t, p, tip], k) => `<div class="label">Prompt ${k + 1} de 4</div><h2>${t}</h2><div class="prompt">${p}</div><p class="tip"><b>Consejo:</b> ${tip}</p>`),
      cta('¿Quieres que la IA lo haga <span class="grad">sin que se lo pidas</span>?', ['Guarda estos prompts', 'Escríbenos <span class="kw">DEMO</span> y te enseñamos cómo automatizarlo']),
    ],
  },
  {
    id: '05-horas-perdidas', single: true, slides: [
      `<span class="tag">Haz la cuenta</span>
       <h2>¿Cuánto tiempo pierdes en <span class="grad">tareas repetitivas</span>?</h2>
       <div class="calc">
         <div class="ln"><span>Solo 30 minutos al día</span><b>30 min</b></div>
         <div class="ln"><span>× 5 días a la semana</span><b>2,5 h</b></div>
         <div class="ln"><span>× 48 semanas de trabajo</span><b>120 h</b></div>
         <div class="ln tot"><span>Equivale a jornadas de 8 h</span><b>15 días</b></div>
       </div>
       <p class="tip" style="margin-top:36px">Y eso con solo media hora al día. <b>¿Cuánto es en tu caso?</b> Cuéntanoslo en comentarios.</p>`,
    ],
  },
  {
    id: '06-servicios-orbixel', slides: [
      cover('Qué hacemos', 'IA a medida para que tu negocio <span class="grad">trabaje solo</span>', 'Esto es lo que montamos en Orbixel.'),
      point('Servicio', 'Asistentes de IA 24/7', 'En <b>WhatsApp, Instagram o tu web</b>. Responden dudas, recogen datos y agendan citas con el tono de tu marca.'),
      point('Servicio', 'Automatizaciones', 'Conectamos tus herramientas para que <b>los datos viajen solos</b>: formularios, CRM, email, hojas de cálculo.'),
      point('Servicio', 'Agentes de IA', 'IA que <b>hace tareas completas</b>: cualifica leads, prepara presupuestos o genera informes.'),
      point('Servicio', 'Consultoría y formación', 'Detectamos <b>dónde te aporta más la IA</b> y formamos a tu equipo para sacarle partido.'),
      cta('¿Hablamos de <span class="grad">tu negocio</span>?', ['Escríbenos <span class="kw">DEMO</span> por DM', 'Te proponemos por dónde empezar']),
    ],
  },
  {
    id: '07-glosario-ia', slides: [
      cover('Glosario', 'La IA explicada <span class="grad">sin tecnicismos</span>', '5 palabras que vas a oír cada vez más.'),
      ...[
        ['Prompt', 'La instrucción que le das a la IA', 'Cuanto más claro y con más contexto, <b>mejor responde</b>. Es como dar un buen encargo a una persona.'],
        ['Chatbot de IA', 'Un asistente que conversa', 'Entiende lo que escribe el cliente y <b>responde con información de tu negocio</b>, no con respuestas fijas.'],
        ['Automatización', 'Tareas que se hacen solas', 'Reglas del tipo <b>«cuando pase X, haz Y»</b> que conectan tus herramientas sin intervención.'],
        ['Agente de IA', 'IA que actúa, no solo responde', 'Puede <b>buscar, decidir y ejecutar varios pasos</b> para completar una tarea por ti.'],
        ['LLM', 'El «cerebro» detrás de la IA', 'Modelo de lenguaje entrenado con muchísimo texto. <b>ChatGPT, Claude o Gemini</b> funcionan con uno.'],
      ].map(([t, s, b]) => `<div class="term">Término</div><h1 style="font-size:110px">${t}</h1><p class="sub" style="color:#fff;font-weight:700;margin-top:30px">${s}</p><p class="body">${b}</p>`),
      cta('¿Qué otro término <span class="grad">te explicamos</span>?', ['Déjalo en comentarios', 'Guárdalo para tenerlo a mano']),
    ],
  },
  {
    id: '08-que-automatizarias', single: true, slides: [
      `<span class="tag">Tu turno</span>
       <h2 style="font-size:66px">Si pudieras automatizar <span class="grad">una sola tarea</span> mañana, ¿cuál sería?</h2>
       <div class="opts" style="margin-top:40px">
         <div class="opt"><b class="grad">A</b>Responder mensajes de clientes</div>
         <div class="opt"><b class="grad">B</b>Agendar citas y recordatorios</div>
         <div class="opt"><b class="grad">C</b>Hacer facturas e informes</div>
         <div class="opt"><b class="grad">D</b>Seguimiento de presupuestos</div>
       </div>
       <p class="tip" style="margin-top:32px">Responde con <b>A, B, C o D</b> en comentarios. Te contamos cómo hacerlo.</p>`,
    ],
  },
  {
    id: '09-como-trabajamos', slides: [
      cover('Nuestro método', 'De la idea a la IA <span class="grad">funcionando</span> en 4 pasos', 'Así trabajamos con cada cliente.'),
      point('Paso 1 de 4', 'Diagnóstico', 'Analizamos tu negocio y <b>detectamos las tareas</b> donde la IA te ahorra más tiempo.'),
      point('Paso 2 de 4', 'Diseño', 'Definimos la solución, <b>el tono de tu marca</b> y cómo se conecta con tus herramientas.'),
      point('Paso 3 de 4', 'Implementación', 'La montamos, <b>la probamos con casos reales</b> y formamos a tu equipo.'),
      point('Paso 4 de 4', 'Mejora continua', 'Revisamos resultados y <b>la ajustamos</b> para que cada mes funcione mejor.'),
      cta('¿Empezamos por el <span class="grad">paso 1</span>?', ['Escríbenos <span class="kw">DEMO</span> por DM', 'Hacemos el diagnóstico contigo']),
    ],
  },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const p of POSTS) {
    const dir = path.join(OUT, p.id);
    fs.mkdirSync(dir, { recursive: true });
    for (let k = 0; k < p.slides.length; k++) {
      await page.setContent(frame({ i: k + 1, n: p.slides.length, inner: p.slides[k], single: p.single }), { waitUntil: 'load' });
      await page.screenshot({ path: path.join(dir, `${String(k + 1).padStart(2, '0')}.png`) });
    }
    console.log(p.id, p.slides.length);
  }

  // Foto de perfil (se ve recortada en círculo y muy pequeña: solo el símbolo).
  const sq = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  const profileDir = path.join(OUT, 'perfil');
  fs.mkdirSync(profileDir, { recursive: true });
  await sq.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
    html,body{width:1080px;height:1080px}
    .c{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
    .ring{width:600px;height:600px;border-radius:50%;border:92px solid transparent;
      background:linear-gradient(var(--bg),var(--bg)) padding-box, linear-gradient(135deg,var(--violet-l),var(--cyan-l)) border-box;
      box-shadow:0 0 120px rgba(124,58,237,.55)}
    .px{position:absolute;width:120px;height:120px;border-radius:22px;background:#fff;left:690px;top:250px;box-shadow:0 0 60px rgba(34,211,238,.8)}
  </style></head><body><div class="bg"></div><div class="c"><div class="ring"></div><div class="px"></div></div></body></html>`, { waitUntil: 'load' });
  await sq.screenshot({ path: path.join(profileDir, 'foto-perfil.png') });

  // Portadas de historias destacadas.
  for (const [name, word] of [['servicios', 'Servicios'], ['casos', 'Clientes'], ['tips', 'Tips IA'], ['demo', 'Demo']]) {
    await sq.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
      html,body{width:1080px;height:1080px}
      .c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px}
      .d{width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,var(--violet-l),var(--cyan-l));box-shadow:0 0 70px var(--violet)}
      .w{font-family:'Inter Display','Inter',sans-serif;font-size:120px;font-weight:800;letter-spacing:-.02em}
    </style></head><body><div class="bg"></div><div class="c"><div class="d"></div><div class="w">${word}</div></div></body></html>`, { waitUntil: 'load' });
    await sq.screenshot({ path: path.join(profileDir, `destacada-${name}.png`) });
  }
  console.log('perfil ok');
  await browser.close();
})();
