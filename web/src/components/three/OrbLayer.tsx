import { lazy, Suspense, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { hasWebGL, isSmallScreen, prefersReducedMotion } from '../../lib/env';
import { orbState } from '../../lib/orbState';
import { onLoaderDone } from '../../lib/motion';

const OrbCanvas = lazy(() => import('./OrbCanvas'));

/**
 * Decide si se muestra el orbe 3D (carga diferida cuando el navegador está libre)
 * o el orbe estático de respaldo (sin WebGL o con movimiento reducido).
 */
export function OrbLayer({ onReady }: { onReady: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(12000);

  useEffect(() => {
    if (prefersReducedMotion() || !hasWebGL()) return;
    const small = isSmallScreen();
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4;
    setCount(small ? 4500 : lowEnd ? 7000 : 12000);
    // El 3D se carga con la primera interacción (o, en escritorio, tras unos segundos):
    // así no compite con el primer pintado ni bloquea el hilo principal al cargar.
    const events = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'] as const;
    let timer = 0;
    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      clearTimeout(timer);
      setEnabled(true);
    };
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    if (!small) timer = window.setTimeout(start, 3500);
    return () => { events.forEach((e) => window.removeEventListener(e, start)); clearTimeout(timer); };
  }, []);

  if (!enabled) return null;
  return (
    <Suspense fallback={null}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <OrbCanvas
          count={count}
          onReady={() => {
            onReady();
            onLoaderDone(() => gsap.to(orbState, { intro: 1, duration: 2.6, ease: 'power2.out' }));
          }}
        />
      </div>
    </Suspense>
  );
}
