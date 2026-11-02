import { useI18n } from '../../i18n';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';
import { CtaButton } from '../ui/CtaButton';

const ICONS = ['search', 'bulb', 'shield', 'route'];

export function Diagnosis() {
  const { t } = useI18n();
  const d = t.diagnosis;
  return (
    <section id="diagnostico" aria-labelledby="diagnostico-title" className="relative py-24 md:py-36" data-section="diagnosis">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <SectionHeader id="diagnostico-title" eyebrow={d.eyebrow} title={d.title} lead={d.lead} />
            <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3" data-reveal="">
              <div className="rounded-2xl border border-line bg-surface/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{d.before}</p>
                <p className="mt-2 font-display text-lg font-medium text-soft md:text-xl">{d.beforeText}</p>
              </div>
              <div className="grid place-items-center text-cyan" aria-hidden="true">
                <svg width="34" height="16" viewBox="0 0 34 16" fill="none"><path d="M1 8h30M25 2l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div className="rounded-2xl border border-cyan/40 bg-cyan/[0.07] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">{d.after}</p>
                <p className="mt-2 font-display text-lg font-semibold md:text-xl">{d.afterText}</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-line bg-surface/60 p-5" data-reveal="">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{d.formulaLabel}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 font-display text-base font-semibold sm:text-lg">
                {d.formula.map((f, i) => (
                  <span key={f} className="flex items-center gap-2">
                    <span className="rounded-lg bg-white/[0.06] px-3 py-1.5">{f}</span>
                    {i < d.formula.length - 1 && <span className="text-violet-soft" aria-hidden="true">×</span>}
                  </span>
                ))}
              </p>
            </div>
            <div className="mt-8" data-reveal="">
              <CtaButton href="#contacto" cursor={t.cta.cursorBook}>{t.cta.primary}</CtaButton>
            </div>
          </div>
          <ul className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {d.items.map((it, i) => (
              <Card as="li" key={it.title} className="p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <div className="icon-chip"><Icon name={ICONS[i]} /></div>
                  <span className="font-display text-xs font-semibold tracking-[0.2em] text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-soft">{it.text}</p>
              </Card>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
