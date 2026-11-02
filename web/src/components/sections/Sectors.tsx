import { useI18n } from '../../i18n';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';
import { CtaButton } from '../ui/CtaButton';

const ICONS = ['scissors', 'sparkle', 'store', 'building'];

export function Sectors() {
  const { t } = useI18n();
  const s = t.sectors;
  return (
    <section id="sectores" aria-labelledby="sectores-title" className="relative py-24 md:py-36" data-section="sectors">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader id="sectores-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
          <div data-reveal="" className="shrink-0">
            <CtaButton href="#contacto" variant="ghost" cursor={t.cta.cursorBook}>{t.cta.primary}</CtaButton>
          </div>
        </div>
        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {s.items.map((it, i) => (
            <Card as="li" key={it.title} className="flex flex-col p-7 md:p-9" tilt={4} cursor={t.cta.cursorView}>
              <div className="flex items-center gap-4">
                <div className="icon-chip !size-12"><Icon name={ICONS[i]} className="size-6" /></div>
                <h3 className="text-2xl font-semibold md:text-[1.7rem]">{it.title}</h3>
              </div>
              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{s.problemsLabel}</p>
              <ul className="mt-3 space-y-2.5">
                {it.problems.map((pr) => (
                  <li key={pr} className="flex items-start gap-3 text-soft">
                    <span className="mt-2 size-1.5 shrink-0 rounded-[2px] bg-danger/80" aria-hidden="true" />
                    {pr}
                  </li>
                ))}
              </ul>
              <div className="mt-7 rounded-2xl border border-cyan/25 bg-cyan/[0.06] p-5 md:mt-auto md:translate-y-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan">{s.improveLabel}</p>
                <p className="mt-2 leading-relaxed">{it.improve}</p>
              </div>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}
