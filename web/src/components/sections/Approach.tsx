import { useI18n } from '../../i18n';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';

export function Approach() {
  const { t } = useI18n();
  const a = t.approach;
  return (
    <section id="enfoque" aria-labelledby="enfoque-title" className="relative py-24 md:py-36" data-section="approach">
      <div className="container-x">
        <SectionHeader id="enfoque-title" eyebrow={a.eyebrow} title={a.titleA} titleAccent={a.titleB} lead={a.lead} className="lg:ml-auto lg:mr-0 lg:max-w-[42rem]" />
        <div className="mt-14 grid gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="rounded-3xl border border-line bg-surface/50 p-7 md:p-9" data-reveal="">
            <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              <span className="grid size-7 place-items-center rounded-full border border-line-strong"><Icon name="x" className="size-3.5" /></span>
              {a.usual.label}
            </h3>
            <ol className="mt-7 space-y-3">
              {a.usual.steps.map((s, i) => (
                <li key={s} className="flex items-start gap-4 rounded-2xl border border-dashed border-line-strong px-5 py-4 text-soft">
                  <span className="mt-0.5 font-display text-sm text-muted">{i + 1}</span>
                  <span className={i === a.usual.steps.length - 1 ? 'text-muted line-through decoration-danger/60' : ''}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-violet/40 bg-gradient-to-br from-violet/15 via-surface/70 to-cyan/10 p-7 md:p-9" data-reveal="">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-violet/30 blur-3xl" />
            <h3 className="relative flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan">
              <span className="grid size-7 place-items-center rounded-full bg-cyan text-bg"><Icon name="check" className="size-3.5" strokeWidth={2.4} /></span>
              {a.orbixel.label}
            </h3>
            <ol className="relative mt-7 space-y-3">
              {a.orbixel.steps.map((s, i) => (
                <li key={s} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 font-medium">
                  <span className="mt-0.5 font-display text-sm text-cyan">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mt-10 text-center font-display text-xl font-medium text-soft md:text-2xl" data-reveal="">{a.partner}</p>
      </div>
    </section>
  );
}
