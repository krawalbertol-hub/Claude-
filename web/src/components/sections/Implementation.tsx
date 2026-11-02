import { useI18n } from '../../i18n';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { SectionHeader } from '../ui/SectionHeader';

const ICONS = ['zap', 'bot', 'message', 'users', 'chart', 'link', 'globe', 'share'];

export function Implementation() {
  const { t } = useI18n();
  const m = t.implementation;
  return (
    <section id="implementacion" aria-labelledby="implementacion-title" className="relative py-24 md:py-36" data-section="implementation">
      <div className="container-x">
        <SectionHeader id="implementacion-title" eyebrow={m.eyebrow} title={m.titleA} titleAccent={m.titleB} lead={m.lead} center />
        <ul className="mt-14 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {m.items.map((it, i) => (
            <Card as="li" key={it.title} className="p-5 md:p-6" tilt={8}>
              <div className="flex items-center gap-3">
                <div className="icon-chip !size-10 !rounded-xl"><Icon name={ICONS[i]} className="size-[1.15rem]" /></div>
                <h3 className="text-lg font-semibold leading-tight">{it.title}</h3>
              </div>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-soft">{it.text}</p>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}
