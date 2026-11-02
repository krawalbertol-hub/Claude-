import { useI18n } from '../../i18n';
import { LEGAL } from '../../i18n/legal';
import { ROUTES } from '../../config/site';

export function LegalPage({ doc }: { doc: 'legal' | 'privacy' | 'cookies' }) {
  const { t, lang } = useI18n();
  const d = LEGAL[lang][doc];
  return (
    <article className="container-x max-w-3xl pb-24 pt-32 md:pt-40">
      <a href={ROUTES[lang].home} className="text-sm text-muted link-underline">← {t.footer.back}</a>
      <h1 className="mt-6 text-[clamp(2.2rem,1.4rem+3vw,3.5rem)] font-bold leading-tight">{d.title}</h1>
      <p className="mt-3 text-sm text-muted">{d.updated}</p>
      <div className="mt-12 space-y-10">
        {d.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-xl font-semibold md:text-2xl">{s.h}</h2>
            {s.p.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-soft">{p}</p>)}
          </section>
        ))}
      </div>
    </article>
  );
}
