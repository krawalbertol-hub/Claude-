import { useI18n } from '../../i18n';
import { OrbixelSymbol } from '../brand/Logo';
import { CtaButton } from '../ui/CtaButton';
import { SplitText } from '../ui/SplitText';

export function Hero({ showFallback }: { showFallback: boolean }) {
  const { t } = useI18n();
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-[34svh] lg:items-center lg:pb-20 lg:pt-32" data-section="hero">
      <div aria-hidden="true" className="noise-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,#000_10%,transparent_65%)]" />
      <div aria-hidden="true" className={`pointer-events-none absolute right-[18vw] top-[9svh] w-[64vw] transition-opacity duration-1000 lg:right-[max(-4vw,calc(50vw-48rem))] lg:top-[18vh] lg:w-[42vw] lg:max-w-[45rem] ${showFallback ? 'opacity-50 lg:opacity-90' : 'opacity-0'}`}>
        <div className="orb-fallback relative w-full" />
      </div>
      <div className="container-x relative">
        <div className="max-w-[46rem] 3xl:max-w-[56rem]">
          <p className="hero-in flex items-center gap-3 text-sm font-medium text-soft">
            <OrbixelSymbol animated spin className="size-9" />
            <span>{t.hero.eyebrow}</span>
          </p>
          <h1 id="hero-title" className="mt-6 text-[clamp(2.6rem,1.4rem+6vw,6.4rem)] font-bold leading-[0.98]">
            <SplitText text={t.hero.titleA} className="block" />
            <SplitText text={t.hero.titleB} className="block" wordClassName="text-gradient" />
          </h1>
          <p className="hero-in lead mt-7 max-w-xl">{t.hero.sub}</p>
          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaButton href="#contacto" cursor={t.cta.cursorBook} className="sm:!px-7">{t.cta.primary}</CtaButton>
            <CtaButton href="#proceso" variant="ghost" cursor={t.cta.cursorView} arrow={false}>{t.cta.secondary}</CtaButton>
          </div>
          <p className="hero-in mt-5 text-sm text-muted">{t.hero.note}</p>
        </div>
      </div>
      <div aria-hidden="true" className="hero-in absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted md:flex">
        {t.hero.scroll}
        <span className="relative h-10 w-px overflow-hidden bg-line-strong"><span className="scroll-dot absolute left-0 top-0 h-3 w-px bg-cyan" /></span>
      </div>
    </section>
  );
}
