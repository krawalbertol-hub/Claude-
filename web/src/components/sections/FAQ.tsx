import { useI18n } from '../../i18n';
import { SITE } from '../../config/site';
import { SectionHeader } from '../ui/SectionHeader';
import { Icon } from '../ui/Icon';

export function useFaqItems() {
  const { t } = useI18n();
  return t.faq.items.map((it, i) => (i === 0 && SITE.diagnosisPriceFrom ? { ...it, a: t.faq.priceWith(SITE.diagnosisPriceFrom) } : it));
}

export function FAQ() {
  const { t } = useI18n();
  const items = useFaqItems();
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 md:py-32" data-section="faq">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="divide-y divide-line border-y border-line">
          {items.map((it) => (
            <details key={it.q} className="faq-item group" data-reveal="">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-semibold md:text-xl [&::-webkit-details-marker]:hidden" data-cursor="">
                <h3>{it.q}</h3>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-open:rotate-45 group-open:border-cyan group-open:text-cyan">
                  <Icon name="plus" className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 pr-12 leading-relaxed text-soft">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
