// Genera la guía PDF "Cómo empezar con IA en tu negocio" (A4) con Playwright.
// Uso: node instagram/tools/render-guia.js
const { chromium } = require('playwright');
const path = require('path');

const OUT = path.join(__dirname, '..', 'guia', 'guia-empezar-con-ia-orbixel.pdf');
const HANDLE = '@orbixel.agency';
const TOTAL = 8;

const CSS = `
@page { size: A4; margin: 0; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter',sans-serif; color:#1B1B2F; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.page { width:210mm; height:297mm; position:relative; overflow:hidden; page-break-after:always; padding:22mm 20mm 26mm; background:#FAFAFE; }
.page:last-child { page-break-after:auto; }
.dark { background:#0A0A18; color:#F4F4FB; }
.dark::before, .dark::after { content:''; position:absolute; border-radius:50%; filter:blur(90px); opacity:.55; }
.dark::before { width:140mm; height:140mm; background:#7C3AED; top:-50mm; right:-55mm; }
.dark::after { width:120mm; height:120mm; background:#06B6D4; bottom:-55mm; left:-50mm; opacity:.4; }
.grid { position:absolute; inset:0; opacity:.07; background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px); background-size:12mm 12mm; }
.inner { position:relative; z-index:1; height:100%; display:flex; flex-direction:column; }
.brand { display:flex; align-items:center; gap:3mm; font-weight:700; letter-spacing:.06em; font-size:10pt; }
.dot { width:4.5mm; height:4.5mm; border-radius:50%; background:linear-gradient(135deg,#A78BFA,#22D3EE); box-shadow:0 0 5mm #8B5CF6; }
.grad { color:#7C3AED; }
.dark .grad { color:#67E8F9; }
.tag { display:inline-block; align-self:flex-start; padding:2mm 5mm; border-radius:99px; font-size:8.5pt; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#6D28D9; background:#EDE9FE; margin-bottom:6mm; }
.dark .tag { color:#C4B5FD; background:rgba(124,58,237,.15); border:1px solid rgba(167,139,250,.5); }
h1 { font-family:'Inter Display','Inter',sans-serif; font-weight:800; font-size:44pt; line-height:1.02; letter-spacing:-.03em; }
h2 { font-family:'Inter Display','Inter',sans-serif; font-weight:800; font-size:26pt; line-height:1.08; letter-spacing:-.02em; margin-bottom:6mm; }
h3 { font-size:13pt; font-weight:700; margin-bottom:2mm; }
p, li { font-size:11pt; line-height:1.6; color:#3A3A55; }
.dark p { color:#C9C9E3; }
.lead { font-size:13pt; line-height:1.55; margin-bottom:8mm; }
.step { font-family:'Inter Display','Inter',sans-serif; font-size:64pt; font-weight:900; line-height:.9; letter-spacing:-.05em; margin-bottom:4mm; color:#7C3AED; }
.box { border-radius:5mm; padding:6mm 7mm; margin-bottom:5mm; background:#fff; border:1px solid #E6E3F5; }
.box.accent { background:linear-gradient(135deg,#F3EEFF,#E8FBFF); border:none; }
.check { list-style:none; }
.check li { padding-left:9mm; position:relative; margin-bottom:2.5mm; }
.check li::before { content:''; position:absolute; left:0; top:1.2mm; width:4.5mm; height:4.5mm; border-radius:1.2mm; border:1.6px solid #7C3AED; }
.two { display:grid; grid-template-columns:1fr 1fr; gap:5mm; }
.matrix { display:grid; grid-template-columns:1fr 1fr; gap:3mm; margin:4mm 0 6mm; }
.q { border-radius:4mm; padding:5mm; min-height:30mm; }
.q b { display:block; font-size:11pt; margin-bottom:1.5mm; } .q span { font-size:9.5pt; line-height:1.45; color:#3A3A55; }
.q1 { background:linear-gradient(135deg,#7C3AED,#06B6D4); } .q1 b, .q1 span { color:#fff; }
.q2 { background:#EDE9FE; } .q3 { background:#E0F7FB; } .q4 { background:#F1F1F6; }
.axis { font-size:8.5pt; color:#8A8AA6; letter-spacing:.06em; text-transform:uppercase; }
.prompt { border-left:3px solid #7C3AED; background:#fff; border-radius:0 3mm 3mm 0; padding:2.4mm 5mm; margin-bottom:2.2mm; }
.prompt b { display:block; font-size:9pt; color:#6D28D9; letter-spacing:.04em; text-transform:uppercase; margin-bottom:1mm; }
.prompt span { font-size:9.5pt; line-height:1.42; color:#2A2A40; }
.foot { position:absolute; left:20mm; right:20mm; bottom:11mm; display:flex; justify-content:space-between; font-size:8.5pt; color:#8A8AA6; z-index:1; }
.toc li { list-style:none; display:flex; gap:5mm; align-items:baseline; padding:3.5mm 0; border-bottom:1px solid #E6E3F5; font-size:12pt; color:#1B1B2F; }
.toc li i { font-style:normal; font-weight:800; color:#7C3AED; width:9mm; }
.cta-btn { display:inline-block; margin-top:8mm; padding:5mm 9mm; border-radius:4mm; font-weight:800; font-size:14pt; color:#fff; background:linear-gradient(90deg,#7C3AED,#06B6D4); }
.kw { display:inline-block; padding:0 3mm; border-radius:2mm; background:#fff; color:#0A0A18; font-weight:900; }
`;

const foot = (n) => `<div class="foot"><span>Orbixel · Guía para empezar con IA</span><span>${n} / ${TOTAL}</span></div>`;

const pages = [
  // 1. Portada
  `<div class="page dark"><div class="grid"></div><div class="inner">
    <div class="brand"><span class="dot"></span>ORBIXEL</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <span class="tag">Guía gratuita</span>
      <h1>Cómo empezar con <span class="grad">IA</span> en tu negocio</h1>
      <p class="lead" style="margin-top:8mm;max-width:140mm">Un plan sencillo en 4 pasos para dejar de perder horas en tareas repetitivas, sin saber programar.</p>
    </div>
    <p style="font-size:10pt">${HANDLE}</p>
  </div></div>`,

  // 2. Intro + índice
  `<div class="page"><div class="inner">
    <span class="tag">Antes de empezar</span>
    <h2>La IA no es el futuro. Es la ventaja que <span class="grad">ya puedes usar hoy.</span></h2>
    <p class="lead">No necesitas un gran presupuesto ni un equipo técnico. Necesitas saber <b>por dónde empezar</b>: qué automatizar primero, cómo probarlo y cómo medir si funciona. Eso es lo que encontrarás aquí.</p>
    <ul class="toc">
      <li><i>01</i>Detecta las tareas que te roban tiempo</li>
      <li><i>02</i>Prioriza: impacto vs. esfuerzo</li>
      <li><i>03</i>Empieza con una prueba pequeña</li>
      <li><i>04</i>Mide y escala lo que funciona</li>
      <li><i>+</i>10 prompts listos para copiar y pegar</li>
      <li><i>+</i>Checklist final</li>
    </ul>
  </div>${foot(2)}</div>`,

  // 3. Paso 1
  `<div class="page"><div class="inner">
    <div class="step">01</div>
    <h2>Detecta las tareas que te roban tiempo</h2>
    <p class="lead">Durante una semana, apunta las tareas que repites a diario. Las mejores candidatas para la IA cumplen al menos dos de estas condiciones:</p>
    <div class="box"><ul class="check">
      <li><b>Son repetitivas:</b> se hacen igual (o casi) cada vez.</li>
      <li><b>Siguen reglas claras:</b> "si pasa X, hago Y".</li>
      <li><b>Implican texto:</b> responder, resumir, redactar, clasificar.</li>
      <li><b>Consumen tiempo</b> pero aportan poco valor estratégico.</li>
    </ul></div>
    <h3>Ejemplos habituales</h3>
    <div class="two">
      <div class="box accent"><p><b>Atención al cliente</b><br>Preguntas frecuentes, horarios, precios, estado de pedidos.</p></div>
      <div class="box accent"><p><b>Agenda</b><br>Reservar, confirmar y recordar citas.</p></div>
      <div class="box accent"><p><b>Comercial</b><br>Responder leads, redactar propuestas, hacer seguimiento.</p></div>
      <div class="box accent"><p><b>Administración</b><br>Informes, resúmenes de reuniones, organizar documentos.</p></div>
    </div>
  </div>${foot(3)}</div>`,

  // 4. Paso 2
  `<div class="page"><div class="inner">
    <div class="step">02</div>
    <h2>Prioriza: impacto vs. esfuerzo</h2>
    <p class="lead">No intentes automatizarlo todo a la vez. Coloca cada tarea de tu lista en esta matriz y <b>empieza por la esquina de arriba a la izquierda</b>.</p>
    <div class="axis">↑ Más impacto</div>
    <div class="matrix">
      <div class="q q1"><b>Empieza aquí</b><span>Mucho impacto, poco esfuerzo. Ej.: responder preguntas frecuentes por WhatsApp.</span></div>
      <div class="q q2"><b>Planifícalo</b><span>Mucho impacto, más esfuerzo. Ej.: conectar la IA con tu CRM.</span></div>
      <div class="q q3"><b>Victorias rápidas</b><span>Poco impacto, poco esfuerzo. Ej.: redactar emails con IA.</span></div>
      <div class="q q4"><b>Déjalo para después</b><span>Poco impacto, mucho esfuerzo. No compensa por ahora.</span></div>
    </div>
    <div class="axis" style="text-align:right">Más esfuerzo →</div>
    <div class="box" style="margin-top:6mm"><p><b>Pregunta clave:</b> si esta tarea se hiciera sola mañana, ¿cuántas horas recuperaría al mes y en qué las invertiría?</p></div>
  </div>${foot(4)}</div>`,

  // 5. Paso 3 y 4
  `<div class="page"><div class="inner">
    <div class="step">03</div>
    <h2>Empieza con una prueba pequeña</h2>
    <p>Elige <b>una sola tarea</b> y pruébala durante 2–4 semanas:</p>
    <div class="box" style="margin-top:4mm"><ul class="check">
      <li>Define el objetivo: p. ej. "responder en menos de 1 minuto".</li>
      <li>Prepara la información que la IA necesita: precios, horarios, FAQs.</li>
      <li>Revisa las respuestas de la IA los primeros días y corrige el tono.</li>
      <li>Mantén siempre la opción de pasar a una persona.</li>
    </ul></div>
    <div class="step" style="margin-top:6mm">04</div>
    <h2>Mide y escala lo que funciona</h2>
    <div class="two">
      <div class="box accent"><h3>Qué medir</h3><p>Horas ahorradas a la semana · Tiempo de respuesta · Citas o ventas generadas · Satisfacción del cliente</p></div>
      <div class="box accent"><h3>Cuándo escalar</h3><p>Cuando la prueba cumple el objetivo, pasa a la siguiente tarea de tu matriz y repite el proceso.</p></div>
    </div>
  </div>${foot(5)}</div>`,

  // 6. Prompts
  `<div class="page"><div class="inner">
    <span class="tag">Bonus</span>
    <h2>10 prompts listos para usar</h2>
    <p style="margin-bottom:4mm">Cópialos en ChatGPT, Claude o tu herramienta de IA favorita y cambia lo que está entre [corchetes].</p>
    ${[
      ['Atención al cliente', 'Actúa como el asistente de [negocio]. Responde de forma amable y breve a esta pregunta de un cliente: [pregunta]. Datos: [horarios, precios, servicios].'],
      ['FAQs', 'Escribe las 10 preguntas más frecuentes que haría un cliente de [tipo de negocio] y una respuesta clara para cada una.'],
      ['Email comercial', 'Redacta un email corto para [tipo de cliente] presentando [servicio]. Tono cercano, un beneficio claro y una llamada a la acción.'],
      ['Seguimiento', 'Escribe un mensaje de seguimiento para un cliente que pidió presupuesto hace [X días] y no ha respondido. Sin sonar insistente.'],
      ['Propuesta', 'Crea la estructura de una propuesta para [cliente] que necesita [problema]. Incluye diagnóstico, solución, plazos y siguientes pasos.'],
      ['Resumen de reunión', 'Resume estas notas en: decisiones tomadas, tareas (con responsable) y próximos pasos: [notas].'],
      ['Redes sociales', 'Dame 5 ideas de posts para Instagram de [negocio] que aporten valor a [público] y terminen con una llamada a la acción.'],
      ['Reseñas', 'Responde a esta reseña de un cliente de forma profesional y empática: [reseña].'],
      ['Informe', 'Analiza estos datos de ventas y dame 3 conclusiones y 3 acciones recomendadas: [datos].'],
      ['Procesos', 'Convierte esta explicación en un procedimiento paso a paso que cualquier persona del equipo pueda seguir: [explicación].'],
    ].map(([t, p]) => `<div class="prompt"><b>${t}</b><span>${p}</span></div>`).join('')}
  </div>${foot(6)}</div>`,

  // 7. Checklist
  `<div class="page"><div class="inner">
    <span class="tag">Checklist</span>
    <h2>Tu plan de acción para esta semana</h2>
    <div class="box"><ul class="check">
      <li>Apunto durante 5 días las tareas repetitivas de mi negocio.</li>
      <li>Marco las que son repetitivas, con reglas claras o basadas en texto.</li>
      <li>Las coloco en la matriz impacto/esfuerzo.</li>
      <li>Elijo UNA tarea de la zona "Empieza aquí".</li>
      <li>Defino un objetivo medible para esa tarea.</li>
      <li>Reúno la información que la IA necesita (precios, FAQs, horarios).</li>
      <li>Pruebo los prompts de esta guía con casos reales.</li>
      <li>Reviso resultados a las 2 semanas y decido si escalar.</li>
    </ul></div>
    <div class="box accent" style="margin-top:4mm"><p><b>Consejo:</b> la IA funciona mejor cuanto mejor la "entrenas" con información de tu negocio. Dedica tiempo a preparar buenos datos: es lo que marca la diferencia.</p></div>
  </div>${foot(7)}</div>`,

  // 8. CTA
  `<div class="page dark"><div class="grid"></div><div class="inner">
    <div class="brand"><span class="dot"></span>ORBIXEL</div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <span class="tag">Siguiente paso</span>
      <h1 style="font-size:38pt">¿Prefieres que lo <span class="grad">hagamos por ti?</span></h1>
      <p class="lead" style="margin-top:8mm;max-width:145mm">En Orbixel diseñamos e implementamos soluciones de IA a medida para tu negocio: asistentes 24/7, automatizaciones y agentes que trabajan mientras tú te centras en crecer.</p>
      <p style="font-size:13pt">Escríbenos <span class="kw">DEMO</span> por mensaje directo en Instagram y te enseñamos cómo quedaría en tu negocio.</p>
      <div><span class="cta-btn">${HANDLE}</span></div>
    </div>
    <p style="font-size:9pt">© Orbixel Agency · Guía gratuita. Compártela con quien la necesite.</p>
  </div></div>`,
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${pages.join('')}</body></html>`, { waitUntil: 'load' });
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('PDF:', OUT);
})();
