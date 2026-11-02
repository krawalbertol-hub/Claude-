import { useEffect, useState } from 'react';
import { I18nProvider } from './i18n';
import { resolveRoute, type PageKey } from './config/site';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/layout/CookieBanner';
import { Cursor } from './components/layout/Cursor';
import { Hero } from './components/sections/Hero';
import { Problem } from './components/sections/Problem';
import { Approach } from './components/sections/Approach';
import { Diagnosis } from './components/sections/Diagnosis';
import { Implementation } from './components/sections/Implementation';
import { Process } from './components/sections/Process';
import { Sectors } from './components/sections/Sectors';
import { WhyUs } from './components/sections/WhyUs';
import { Cases } from './components/sections/Cases';
import { FAQ } from './components/sections/FAQ';
import { ContactForm } from './components/sections/ContactForm';
import { LegalPage } from './components/legal/LegalPage';
import { OrbLayer } from './components/three/OrbLayer';
import { isFinePointer, prefersReducedMotion } from './lib/env';
import { getConsent, loadAnalytics } from './lib/consent';
import { scrollToHash } from './lib/scroll';
import { initMotion } from './lib/motion';

export function App({ url }: { url: string }) {
  const { lang, page } = resolveRoute(url);
  return (
    <I18nProvider lang={lang}>
      <Shell page={page} />
    </I18nProvider>
  );
}

function Shell({ page }: { page: PageKey }) {
  const isHome = page === 'home';
  const [orbReady, setOrbReady] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [cursor, setCursor] = useState(false);

  // Consentimiento: el banner solo aparece en cliente y la analítica solo se carga si ya se aceptó.
  useEffect(() => {
    const c = getConsent();
    if (c === null) setShowCookies(true);
    else if (c === 'accepted') loadAnalytics();
    setCursor(isFinePointer() && !prefersReducedMotion());
  }, []);

  // Movimiento: Lenis + GSAP (se omite por completo con prefers-reduced-motion)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Se inicia en una tarea aparte tras la hidratación para no alargar las tareas largas iniciales.
    let cleanup: (() => void) | undefined;
    let t = 0;
    const boot = window.setTimeout(() => {
      cleanup = initMotion({ orb: isHome });
      if (location.hash) t = window.setTimeout(() => scrollToHash(location.hash), 300);
    }, 120);
    return () => { clearTimeout(boot); clearTimeout(t); cleanup?.(); };
  }, [isHome]);

  return (
    <>
      <Header page={page} />
      {isHome && <OrbLayer onReady={() => setOrbReady(true)} />}
      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        {isHome ? (
          <>
            <Hero showFallback={!orbReady} />
            <Problem />
            <Approach />
            <Diagnosis />
            <Implementation />
            <Process />
            <Sectors />
            <WhyUs />
            <Cases />
            <FAQ />
            <ContactForm />
          </>
        ) : (
          <LegalPage doc={page} />
        )}
      </main>
      <div className="relative z-10">
        <Footer onCookieSettings={() => setShowCookies(true)} />
      </div>
      {showCookies && <CookieBanner onClose={() => setShowCookies(false)} />}
      {cursor && <Cursor />}
      <div aria-hidden="true" data-progress="" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-violet to-cyan" />
    </>
  );
}
