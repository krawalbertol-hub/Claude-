import { useI18n } from '../../i18n';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';
import { CtaButton } from '../ui/CtaButton';

const ICONS = ['clock', 'chat', 'calendarX', 'plug'];

export function Problem() {
  const { t } = useI18n();
  return (
    <section id="problema" aria-labelledby="problema-title" className="relative py-24 md:py-36" data-section="problem">
      <div className="container-x">
        <SectionHeader id="problema-title" eyebrow={t.problem.eyebrow} title={t.problem.title} lead={t.problem.lead} />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.problem.items.map((it, i) => (
            <Card as="li" key={it.title} className="p-6 md:p-7">
              <span className="font-display text-xs font-semibold tracking-[0.2em] text-muted">0{i + 1}</span>
              <div className="icon-chip mt-5"><Icon name={ICONS[i]} /></div>
              <h3 className="mt-5 text-xl font-semibold leading-tight">{it.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-soft">{it.text}</p>
            </Card>
          ))}
        </ul>
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-surface/60 p-7 md:flex-row md:items-center md:p-9" data-reveal="">
          <p className="font-display text-2xl font-semibold leading-tight md:text-3xl">{t.problem.closing}</p>
          <CtaButton href="#contacto" cursor={t.cta.cursorBook}>{t.problem.cta}</CtaButton>
        </div>
      </div>
    </section>
  );
}
