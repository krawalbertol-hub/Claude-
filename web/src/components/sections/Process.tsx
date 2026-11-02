import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../../i18n';
import { SplitText } from '../ui/SplitText';
import { prefersReducedMotion } from '../../lib/env';

/** Órbita interactiva de las 7 fases. En escritorio la sección se fija y el scroll recorre las fases. */
export function Process() {
  const { t } = useI18n();
  const p = t.process;
  const n = p.phases.length;
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const step = 360 / n;
  const rot = -active * step;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (min-height: 620px)', () => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: pinRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.55 * n}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, [n]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section ref={sectionRef} id="proceso" aria-labelledby="proceso-title" className="relative" data-section="process">
      <div ref={pinRef} className="flex min-h-[100svh] items-center py-24 lg:py-16">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <div className="order-2 lg:order-1">
            <p className="eyebrow" data-reveal="">{p.eyebrow}</p>
            <h2 id="proceso-title" className="h-section mt-4"><SplitText text={p.title} /></h2>
            <p className="lead mt-5 max-w-xl" data-reveal="">{p.lead}</p>

            <div className="relative mt-10 min-h-[11rem] rounded-3xl border border-line bg-surface/60 p-7 md:p-8" data-reveal="">
              {p.phases.map((ph, i) => (
                <div key={ph.title} role="tabpanel" id={`phase-panel-${i}`} aria-labelledby={`phase-tab-${i}`} hidden={i !== active} tabIndex={0} className="phase-panel rounded-xl">
                  <p className="font-display text-sm font-semibold tracking-[0.2em] text-cyan">
                    {p.phaseLabel} {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-bold md:text-4xl">{ph.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-soft">{ph.text}</p>
                </div>
              ))}
              <div className="mt-6 flex gap-1.5" aria-hidden="true">
                {p.phases.map((_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-gradient-to-r from-violet to-cyan' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">{p.hint}</p>
          </div>

          <div className="order-1 mx-auto w-full max-w-[min(88vw,34rem)] lg:order-2 lg:max-w-[min(70vh,36rem)]">
            <div data-orb-anchor="" className="orbit relative aspect-square w-full [container-type:inline-size]">
              {/* Pista orbital */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
                <defs>
                  <linearGradient id="orbit-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6C5CFF" />
                    <stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth=".3" strokeDasharray=".6 1.2" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth=".3" />
                <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: '50px 50px', transition: 'transform 1s cubic-bezier(.16,1,.3,1)' }}>
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="url(#orbit-g)" strokeWidth=".7" strokeLinecap="round"
                    pathLength={n} strokeDasharray={`${active + 0.001} ${n}`}
                    style={{ transform: 'rotate(180deg)', transformOrigin: '50px 50px', transition: 'stroke-dasharray 1s cubic-bezier(.16,1,.3,1)' }}
                  />
                </g>
              </svg>

              {/* Centro */}
              <div className="pointer-events-none absolute inset-[30%] grid place-items-center rounded-full text-center" aria-hidden="true">
                <div>
                  <p className="font-display text-[11cqw] font-bold leading-none text-gradient">{String(active + 1).padStart(2, '0')}</p>
                  <p className="mt-1 text-[2.6cqw] font-semibold uppercase tracking-[0.25em] text-muted">{p.phases[active].title}</p>
                </div>
              </div>

              {/* Fases */}
              <div role="tablist" aria-label={p.title} aria-orientation="horizontal" className="absolute inset-0" style={{ transform: `rotate(${rot}deg)`, transition: 'transform 1s cubic-bezier(.16,1,.3,1)' }}>
                {p.phases.map((ph, i) => {
                  const a = i * step;
                  const on = i === active;
                  return (
                    <div key={ph.title} className="absolute left-1/2 top-1/2 size-0" style={{ transform: `rotate(${a}deg) translateX(-40cqw) rotate(${-a}deg)` }}>
                      <div style={{ transform: `rotate(${-rot}deg)`, transition: 'transform 1s cubic-bezier(.16,1,.3,1)' }}>
                        <button
                          ref={(el) => { tabsRef.current[i] = el; }}
                          type="button"
                          role="tab"
                          id={`phase-tab-${i}`}
                          aria-selected={on}
                          aria-controls={`phase-panel-${i}`}
                          tabIndex={on ? 0 : -1}
                          onClick={() => setActive(i)}
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          onKeyDown={(e) => onKey(e, i)}
                          data-cursor=""
                          className={`group absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-[clamp(.7rem,2.6cqw,.95rem)] font-semibold whitespace-nowrap transition-all duration-500 ${
                            on ? 'scale-110 border-cyan/70 bg-cyan/15 text-fg shadow-[0_0_30px_rgba(34,211,238,.35)]' : 'border-line-strong bg-bg/70 text-muted hover:text-fg'
                          }`}
                        >
                          <span className={`grid size-[clamp(1.5rem,6cqw,2rem)] place-items-center rounded-full font-display text-[0.8em] transition-colors ${on ? 'bg-cyan text-bg' : 'bg-white/10 text-soft'}`}>
                            {i + 1}
                          </span>
                          {ph.title}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
