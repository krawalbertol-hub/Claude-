/* ==========================================================================
   ROCADVENTUR · JavaScript (vanilla, sense dependències)
   ========================================================================== */

/* ---------- CONFIGURACIÓ ----------
   Data i hora d'inici de l'activitat: dilluns 21 de desembre de 2026 a les 9:00.
   S'indica amb la zona horària (+01:00, hora d'hivern a Catalunya) perquè el compte
   enrere sigui correcte encara que el dispositiu tingui una altra zona configurada.
   Si canvia la data, actualitzeu-la aquí i també al hero d'index.html. */
const DATA_ACTIVITAT = '2026-12-21T09:00:00+01:00';

/* Llista de les 10 proves. Cada prova té:
   - titol, etiqueta (subtítol curt), icona (id del sprite SVG)
   - pos: posició al mapa aeri [x, y] en % (esquerra, dalt) sobre img/mapa-estacions.jpg
   - descripcio i punts (llista de regles de puntuació: [text, punts]) */
const PROVES = [
  {
    titol: 'Crossbar Challenge',
    etiqueta: 'Futbol',
    icona: 'i-travesser',
    pos: [34.3, 27.6],
    descripcio: 'Xuts per torns per tocar el travesser de la porteria. Precisió i sang freda.',
    punts: [
      ['Cada toc al travesser', '1 punt'],
      ['Només compten els encerts dins del temps', '—']
    ]
  },
  {
    titol: 'Globus volador',
    etiqueta: 'Coordinació',
    icona: 'i-globus',
    pos: [54.2, 39.7],
    descripcio: 'Porteu un globus del punt A al punt B sense que toqui a terra. Ningú no el pot tocar dues vegades seguides.',
    punts: [
      ['Arribar al punt B sense que caigui', 'Punts base'],
      ['Variants amb parts del cos concretes', 'Més punts']
    ]
  },
  {
    titol: "Pilota a l'aro",
    etiqueta: 'Punteria',
    icona: 'i-aro',
    pos: [67.6, 23.0],
    descripcio: 'Llançament tipus petanca: heu de ficar la pilota dins d\'un cèrcol col·locat a terra.',
    punts: [
      ['Pilota dins del cèrcol', 'Punts'],
      ['Com més distància', 'Més punts']
    ]
  },
  {
    titol: 'Cursa de la cullera',
    etiqueta: 'Equilibri',
    icona: 'i-cullera',
    pos: [50.0, 24.1],
    descripcio: 'Porteu pilotes de ping-pong del punt A al B amb una cullera a la boca, sense mans. Si cau, tornes a començar.',
    punts: [
      ['Cada pilota que arriba al punt B', '1 punt'],
      ['Si la pilota cau', 'Torna a l\'inici']
    ]
  },
  {
    titol: 'Tirs de bàsquet',
    etiqueta: 'Bàsquet',
    icona: 'i-basquet',
    pos: [75.9, 80.6],
    descripcio: 'Tres nivells de tir: tir lliure, mitja distància i triple. I compte: hi ha una ruleta sorpresa!',
    punts: [
      ['Tir lliure', 'Menys punts'],
      ['Mitja distància', 'Punts mitjans'],
      ['Triple', 'Més punts'],
      ['Ruleta sorpresa', '?']
    ]
  },
  {
    titol: 'Encerta la galleda',
    etiqueta: 'Precisió',
    icona: 'i-galleda',
    pos: [70.5, 37.3],
    descripcio: 'Amb una pala de bàdminton, feu entrar la pilota a una de les 4 galledes.',
    punts: [
      ['Galleda més propera', 'Menys punts'],
      ['Galleda més llunyana', 'Més punts']
    ]
  },
  {
    titol: 'El nus humà',
    etiqueta: 'Cooperació',
    icona: 'i-nus',
    pos: [71.6, 53.1],
    descripcio: 'Amb els ulls tancats, us doneu les mans. Després heu de desfer el nus sense deixar-vos anar.',
    punts: [
      ['Menys de 2 minuts', '4 punts'],
      ['De 2 a 3 minuts', '3 punts'],
      ['De 3 a 4 minuts', '2 punts'],
      ['Més de 4 minuts', '1 punt']
    ]
  },
  {
    titol: 'Tir amb arc',
    etiqueta: 'Punteria',
    icona: 'i-arc',
    pos: [59.1, 63.6],
    descripcio: 'Fletxes amb ventosa contra una diana. Apunta bé i respira.',
    punts: [
      ['Segons la zona de la diana on toqui', 'Punts per zona'],
      ['Centre de la diana', 'Màxim']
    ]
  },
  {
    titol: "Llançament d'anelles",
    etiqueta: 'Habilitat',
    icona: 'i-anelles',
    pos: [53.6, 83.3],
    descripcio: 'Encerteu anelles en cons, pals i bitlles.',
    punts: [
      ['Cada objectiu té una puntuació diferent', 'Segons distància'],
      ['Objectius més llunyans', 'Més punts']
    ]
  },
  {
    titol: 'Torre de gots',
    etiqueta: 'Construcció',
    icona: 'i-gots',
    pos: [43.0, 63.0],
    descripcio: 'Reproduïu figures amb gots de plàstic: piràmides, torres, escales…',
    punts: [
      ['Com més difícil és la figura', 'Més punts'],
      ['Només compta si la figura queda estable', '—']
    ]
  }
];

/* Preferència de moviment reduït de l'usuari */
const menysMoviment = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 2. Capçalera i menú mòbil ---------- */
const capcalera = document.getElementById('capcalera');
const botoMenu = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu-principal');

function obreTancaMenu(obrir) {
  botoMenu.setAttribute('aria-expanded', String(obrir));
  botoMenu.querySelector('.visually-hidden').textContent = obrir ? 'Tanca el menú' : 'Obre el menú';
  menu.classList.toggle('is-open', obrir);
  capcalera.classList.toggle('is-open', obrir);
}

botoMenu.addEventListener('click', () => {
  obreTancaMenu(botoMenu.getAttribute('aria-expanded') !== 'true');
});

// Tanca el menú en triar una secció
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => obreTancaMenu(false)));

// Tanca el menú amb la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) {
    obreTancaMenu(false);
    botoMenu.focus();
  }
});

/* ---------- 3. Efectes en fer scroll (capçalera i botó "tornar a dalt") ---------- */
const botoDalt = document.querySelector('.to-top');
let esperantFrame = false;

function enFerScroll() {
  const y = window.scrollY;
  capcalera.classList.toggle('is-scrolled', y > 20);
  botoDalt.classList.toggle('is-visible', y > 600);
  esperantFrame = false;
}
window.addEventListener('scroll', () => {
  if (!esperantFrame) { esperantFrame = true; requestAnimationFrame(enFerScroll); }
}, { passive: true });
enFerScroll();

/* Marca l'enllaç del menú de la secció visible */
const enllacosMenu = [...menu.querySelectorAll('a')];
const observadorSeccions = new IntersectionObserver((entrades) => {
  entrades.forEach((entrada) => {
    if (entrada.isIntersecting) {
      enllacosMenu.forEach((a) => {
        const actiu = a.getAttribute('href') === '#' + entrada.target.id;
        a.classList.toggle('is-active', actiu);
        if (actiu) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
enllacosMenu.forEach((a) => {
  const seccio = document.querySelector(a.getAttribute('href'));
  if (seccio) observadorSeccions.observe(seccio);
});

/* ---------- 4. Compte enrere ---------- */
const objectiu = new Date(DATA_ACTIVITAT).getTime();
const caselles = {
  dies: document.querySelector('[data-cd="dies"]'),
  hores: document.querySelector('[data-cd="hores"]'),
  minuts: document.querySelector('[data-cd="minuts"]'),
  segons: document.querySelector('[data-cd="segons"]')
};
const missatgeCompte = document.querySelector('.countdown__msg');
const dosDigits = (n) => String(n).padStart(2, '0');
let intervalCompte;

function actualitzaCompte() {
  const resta = objectiu - Date.now();

  if (isNaN(objectiu) || resta <= 0) {
    Object.values(caselles).forEach((c) => { c.textContent = '00'; });
    missatgeCompte.hidden = false;
    missatgeCompte.textContent = isNaN(objectiu)
      ? 'Data no vàlida a DATA_ACTIVITAT.'
      : 'Ja hi som! Que comenci ROCADVENTUR!';
    clearInterval(intervalCompte);
    return;
  }

  const s = Math.floor(resta / 1000);
  caselles.dies.textContent = Math.floor(s / 86400);
  caselles.hores.textContent = dosDigits(Math.floor((s % 86400) / 3600));
  caselles.minuts.textContent = dosDigits(Math.floor((s % 3600) / 60));
  caselles.segons.textContent = dosDigits(s % 60);
}
actualitzaCompte();
intervalCompte = setInterval(actualitzaCompte, 1000);

/* ---------- 5. Targetes de les proves ---------- */
const llista = document.getElementById('llista-proves');

PROVES.forEach((prova, i) => {
  const li = document.createElement('li');
  li.className = 'reveal';
  li.innerHTML = `
    <button class="test-card" type="button" data-prova="${i}" aria-haspopup="dialog">
      <span class="test-card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <span class="test-card__icon"><svg class="icon" aria-hidden="true"><use href="#${prova.icona}"/></svg></span>
      <span class="test-card__title"><span class="visually-hidden">Prova ${i + 1}: </span>${prova.titol}</span>
      <span class="test-card__tag">${prova.etiqueta}</span>
      <span class="test-card__more" aria-hidden="true">Veure detalls →</span>
    </button>`;
  llista.appendChild(li);
});

/* ---------- 6. Modal de detall ---------- */
const modal = document.getElementById('modal-prova');
const modalEls = {
  icona: document.getElementById('modal-icona'),
  num: document.getElementById('modal-num'),
  titol: document.getElementById('modal-titol'),
  desc: document.getElementById('modal-desc'),
  punts: document.getElementById('modal-punts')
};
let provaActual = 0;
let elementOrigen = null;

function ompleModal(i) {
  provaActual = (i + PROVES.length) % PROVES.length; // fa la volta de 10 a 1
  const p = PROVES[provaActual];
  modalEls.icona.setAttribute('href', '#' + p.icona);
  modalEls.num.textContent = `Prova ${provaActual + 1} de ${PROVES.length} · ${p.etiqueta}`;
  modalEls.titol.textContent = p.titol;
  modalEls.desc.textContent = p.descripcio;
  modalEls.punts.innerHTML = '<ul>' + p.punts
    .map(([text, pts]) => `<li><span>${text}</span><span class="pts">${pts}</span></li>`)
    .join('') + '</ul>';
}

function obreModal(i) {
  ompleModal(i);
  elementOrigen = document.activeElement;
  if (typeof modal.showModal === 'function') modal.showModal();
  else modal.setAttribute('open', ''); // navegadors antics
  document.body.style.overflow = 'hidden';
}

function tancaModal() {
  if (typeof modal.close === 'function') modal.close();
  else modal.removeAttribute('open');
}

modal.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (elementOrigen) elementOrigen.focus(); // torna el focus a la targeta
});

llista.addEventListener('click', (e) => {
  const boto = e.target.closest('[data-prova]');
  if (boto) obreModal(Number(boto.dataset.prova));
});

modal.querySelector('.modal__close').addEventListener('click', tancaModal);

// Clic fora de la caixa (al fons) tanca el modal
modal.addEventListener('click', (e) => { if (e.target === modal) tancaModal(); });

// Botons anterior / següent i fletxes del teclat
modal.querySelectorAll('[data-modal-nav]').forEach((b) => {
  b.addEventListener('click', () => ompleModal(provaActual + Number(b.dataset.modalNav)));
});
modal.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') ompleModal(provaActual + 1);
  if (e.key === 'ArrowLeft') ompleModal(provaActual - 1);
});

/* ---------- 7. Mapa aeri amb les 10 estacions ---------- */
(function dibuixaEstacions() {
  const mapa = document.getElementById('mapa-estacions');
  const llegenda = document.getElementById('llegenda-estacions');

  PROVES.forEach((p, i) => {
    const n = i + 1;

    // Marcador numerat sobre la imatge
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'pin';
    pin.dataset.prova = i;
    pin.style.left = p.pos[0] + '%';
    pin.style.top = p.pos[1] + '%';
    pin.style.setProperty('--retard', `${i * 90}ms`);
    pin.setAttribute('aria-label', `Estació ${n}: ${p.titol}`);
    pin.setAttribute('aria-haspopup', 'dialog');
    pin.innerHTML = `<span aria-hidden="true">${n}</span>`;
    mapa.appendChild(pin);

    // Element de la llegenda
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="legend__item" type="button" data-prova="${i}" aria-haspopup="dialog">
        <span class="legend__num" aria-hidden="true">${n}</span>
        <span class="legend__name"><span class="visually-hidden">Estació ${n}: </span>${p.titol}</span>
      </button>`;
    llegenda.appendChild(li);
  });

  // Ressalta el marcador quan es passa per sobre de la llegenda (i al revés)
  const ressalta = (i, actiu) => {
    document.querySelectorAll(`#on [data-prova="${i}"]`).forEach((el) => el.classList.toggle('is-hot', actiu));
  };
  document.querySelectorAll('#on [data-prova]').forEach((el) => {
    const i = el.dataset.prova;
    ['mouseenter', 'focus'].forEach((ev) => el.addEventListener(ev, () => ressalta(i, true)));
    ['mouseleave', 'blur'].forEach((ev) => el.addEventListener(ev, () => ressalta(i, false)));
    // En clicar s'obre la mateixa fitxa que a la secció de proves
    el.addEventListener('click', () => obreModal(Number(i)));
  });
})();

/* ---------- 8. Aparicions en fer scroll i comptadors animats ---------- */
function animaComptador(el) {
  const final = Number(el.dataset.count);
  if (menysMoviment) { el.textContent = final; return; }
  const durada = 1200;
  const inici = performance.now();
  const pas = (ara) => {
    const prog = Math.min((ara - inici) / durada, 1);
    const suau = 1 - Math.pow(1 - prog, 3); // ease-out
    el.textContent = Math.round(final * suau);
    if (prog < 1) requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}

const observadorAparicions = new IntersectionObserver((entrades, obs) => {
  entrades.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add('is-visible');
    entrada.target.querySelectorAll('[data-count]').forEach(animaComptador);
    obs.unobserve(entrada.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Petit retard escalonat entre elements germans
  el.style.transitionDelay = `${(i % 5) * 60}ms`;
  observadorAparicions.observe(el);
});

/* ---------- 9. Neu al hero (decorativa i lleugera) ---------- */
if (!menysMoviment) {
  const capaNeu = document.querySelector('.hero__snow');
  const quantitat = window.innerWidth < 600 ? 22 : 45;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < quantitat; i++) {
    const floc = document.createElement('span');
    floc.className = 'flake';
    floc.style.left = Math.random() * 100 + '%';
    floc.style.setProperty('--s', (2 + Math.random() * 5).toFixed(1) + 'px');
    floc.style.setProperty('--o', (0.3 + Math.random() * 0.6).toFixed(2));
    floc.style.setProperty('--d', (9 + Math.random() * 12).toFixed(1) + 's');
    floc.style.setProperty('--del', (-Math.random() * 20).toFixed(1) + 's');
    floc.style.setProperty('--x', (Math.random() * 80 - 40).toFixed(0) + 'px');
    fragment.appendChild(floc);
  }
  capaNeu.appendChild(fragment);
}
