import type Lenis from 'lenis';

// Referencia global a Lenis para poder hacer scroll a anclas desde cualquier componente.
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash) as HTMLElement | null;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  // Mover el foco al destino para usuarios de teclado
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  history.replaceState(null, '', hash);
}
