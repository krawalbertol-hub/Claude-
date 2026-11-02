import { useI18n } from '../../i18n';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';
import { OrbixelSymbol } from '../brand/Logo';

const ICONS = ['pin', 'compass', 'layers', 'shield'];

export function WhyUs() {
  const { t } = useI18n();
  const w = t.why;
  return (
    <section id="por-que" aria-labelledby="porque-title" className="relative py-24 md:py-36" data-section="why">
      <div className="container-x">
        <SectionHeader id="porque-title" eyebrow={w.eyebrow} title={w.title} />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {w.items.map((it, i) => (
            <li key={it.title} className="bg-bg/90 p-7 transition-colors duration-500 hover:bg-surface md:p-10" data-reveal="">
              <Icon name={ICONS[i]} className="size-7 text-cyan" />
              <h3 className="mt-6 text-2xl font-semibold">{it.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-soft">{it.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 flex items-center justify-center gap-3 text-center font-display text-lg font-medium text-soft md:text-xl" data-reveal="">
          <OrbixelSymbol className="size-7 shrink-0" />
          {w.team}
        </p>
      </div>
    </section>
  );
}
