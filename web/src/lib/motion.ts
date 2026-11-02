import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { orbState, type OrbState } from './orbState';
import { setLenis } from './scroll';

gsap.registerPlugin(ScrollTrigger);

type Frame = Omit<OrbState, 'intro'>;
const shape = (s: 'sphere' | 'chaos' | 'grid' | 'ring') => ({ sphere: 0, chaos: 0, grid: 0, ring: 0, [s]: 1 });
const VISIBLE_H = 2 * 6 * Math.tan((45 / 2) * (Math.PI / 180)); // alto visible del plano z=0 (cámara z=6, fov 45)

/** Fotogramas clave del orbe por sección (responsive). */
function frames(desktop: boolean): Record<string, () => Frame> {
  const d = desktop;
  return {
    hero: () => ({ ...shape('sphere'), x: d ? 2.1 : 0, y: d ? -0.1 : 1.6, scale: d ? 1 : 0.5, opacity: d ? 1 : 0.85 }),
    problem: () => ({ ...shape('chaos'), x: 0, y: 0, scale: d ? 1.1 : 0.85, opacity: d ? 0.5 : 0.3 }),
    approach: () => ({ ...shape('sphere'), x: d ? -3.3 : 0, y: d ? -0.2 : 0.6, scale: d ? 0.75 : 0.6, opacity: d ? 0.45 : 0.25 }),
    diagnosis: () => ({ ...shape('grid'), x: d ? 2.4 : 0, y: d ? -0.9 : -0.4, scale: d ? 0.9 : 0.6, opacity: d ? 0.5 : 0.25 }),
    implementation: () => ({ ...shape('sphere'), x: 0, y: 0, scale: d ? 1.3 : 0.9, opacity: 0.22 }),
    process: () => {
      const anchor = document.querySelector<HTMLElement>('[data-orb-anchor]');
      const section = document.querySelector<HTMLElement>('[data-section="process"]');
      if (!anchor || !section || !d) return { ...shape('chaos'), x: 0, y: 0, scale: 0.8, opacity: 0.12 };
      const r = anchor.getBoundingClientRect(); const s = section.getBoundingClientRect();
      const u = VISIBLE_H / window.innerHeight;
      const cx = r.left + r.width / 2; const cy = r.top - s.top + r.height / 2; // posición cuando la sección está fijada arriba
      return { ...shape('ring'), x: (cx - window.innerWidth / 2) * u, y: -(cy - window.innerHeight / 2) * u, scale: (0.4 * r.width * u) / 1.9, opacity: 0.7 };
    },
    sectors: () => ({ ...shape('chaos'), x: d ? 1 : 0, y: 0, scale: d ? 1.2 : 0.9, opacity: 0.22 }),
    why: () => ({ ...shape('sphere'), x: d ? 3.4 : 0, y: d ? 0.9 : 0.8, scale: d ? 0.6 : 0.55, opacity: d ? 0.4 : 0.2 }),
    cases: () => ({ ...shape('grid'), x: 0, y: -1.6, scale: d ? 1.1 : 0.7, opacity: 0.18 }),
    faq: () => ({ ...shape('sphere'), x: d ? -3.1 : 0, y: d ? -0.4 : 0.9, scale: d ? 0.75 : 0.5, opacity: d ? 0.45 : 0.12 }),
    contact: () => ({ ...shape('sphere'), x: d ? 2.6 : 0, y: d ? 0 : 1.4, scale: d ? 1.05 : 0.6, opacity: d ? 0.6 : 0.12 }),
  };
}

const ORDER = ['hero', 'problem', 'approach', 'diagnosis', 'implementation', 'process', 'sectors', 'why', 'cases', 'faq', 'contact'];

function buildOrbTimeline(desktop: boolean) {
  const F = frames(desktop);
  Object.assign(orbState, F.hero());
  const keys = ['sphere', 'chaos', 'grid', 'ring', 'x', 'y', 'scale', 'opacity'] as const;
  const fnVals = (k: string) => Object.fromEntries(keys.map((p) => [p, () => F[k]()[p]]));
  for (let i = 1; i < ORDER.length; i++) {
    const sec = document.querySelector(`[data-section="${ORDER[i]}"]`);
    if (!sec) continue;
    gsap.fromTo(orbState, fnVals(ORDER[i - 1]), {
      ...fnVals(ORDER[i]),
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: sec,
        start: 'top bottom',
        end: ORDER[i] === 'process' && desktop ? 'top top' : 'top 30%',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  }
}

export function onLoaderDone(cb: () => void) {
  const html = document.documentElement;
  if (!html.classList.contains('is-loading') || html.classList.contains('loader-done')) { cb(); return; }
  window.addEventListener('orbixel:loaded', cb, { once: true });
}

/** Inicializa scroll suave, revelados y el guion del orbe. Devuelve la función de limpieza. */
export function initMotion({ orb }: { orb: boolean }) {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: false });
  setLenis(lenis);
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const ctx = gsap.context(() => {
    // Entrada del hero: solo cuando se muestra el loader (en visitas repetidas el hero aparece directamente)
    if (document.documentElement.classList.contains('is-loading')) {
      const heroWords = gsap.utils.toArray<HTMLElement>('#inicio [data-split] .split-inner');
      const heroIn = gsap.utils.toArray<HTMLElement>('#inicio .hero-in');
      gsap.set(heroWords, { yPercent: 110 });
      gsap.set(heroIn, { y: 18 }); // solo transform: el texto sigue pintado (bueno para LCP)
      onLoaderDone(() => {
        gsap.to(heroWords, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, delay: 0.05 });
        gsap.to(heroIn, { y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.3 });
      });
    }

    // Revelado de titulares palabra a palabra
    gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
      if (el.closest('#inicio')) return;
      const words = el.querySelectorAll('.split-inner');
      gsap.from(words, {
        yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.04,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    // Revelado de bloques
    gsap.set('[data-reveal]', { y: 36, autoAlpha: 0 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.07, overwrite: true, clearProps: 'transform,visibility,opacity' }),
    });

    // Parallax sutil
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.15');
      gsap.to(el, { yPercent: -100 * speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Barra de progreso de lectura
    const bar = document.querySelector<HTMLElement>('[data-progress]');
    if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  });

  const mm = gsap.matchMedia();
  if (orb) {
    mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023.98px)' }, (c) => {
      buildOrbTimeline(!!c.conditions?.desktop);
    });
  }

  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh);

  return () => {
    window.removeEventListener('load', refresh);
    mm.revert();
    ctx.revert();
    gsap.ticker.remove(tick);
    lenis.destroy();
    setLenis(null);
  };
}

export { gsap, ScrollTrigger };
