import { useEffect, useRef } from 'react';

/** Cursor personalizado: punto + anillo con inercia. Solo con ratón y sin movimiento reducido. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const d = dot.current!; const r = ring.current!; const l = label.current!;
    document.documentElement.classList.add('has-cursor');
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      d.classList.remove('is-hidden'); r.classList.remove('is-hidden');
    };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      r.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('a, button, summary, label, [data-cursor], select');
      if (el?.closest('input, textarea, select')) { r.classList.add('is-hidden'); d.classList.add('is-hidden'); return; }
      const text = el?.dataset.cursor;
      r.classList.toggle('is-hover', !!el && !text);
      r.classList.toggle('is-label', !!text);
      l.textContent = text ?? '';
    };
    const leave = () => { d.classList.add('is-hidden'); r.classList.add('is-hidden'); };
    const down = () => r.animate([{ scale: 1 }, { scale: 0.8 }, { scale: 1 }], { duration: 300, easing: 'ease-out' });
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring is-hidden" aria-hidden="true"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot is-hidden" aria-hidden="true" />
    </>
  );
}
