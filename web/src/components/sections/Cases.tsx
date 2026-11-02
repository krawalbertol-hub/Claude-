import { useI18n } from '../../i18n';
import { SectionHeader } from '../ui/SectionHeader';
import { CtaButton } from '../ui/CtaButton';

/**
 * Casos reales. IMPORTANTE: no inventar clientes, cifras ni testimonios.
 * Para publicar un caso, sustituye un elemento de CASES por datos reales y con permiso del cliente.
 */
type CaseData = { sector: string; challenge: string; solution: string; result: string } | null;
const CASES: CaseData[] = [null, null, null]; // [CASO REAL PENDIENTE] ×3

export function Cases() {
  const { t } = useI18n();
  const c = t.cases;
  return (
    <section id="casos" aria-labelledby="casos-title" className="relative py-24 md:py-32" data-section="cases">
      <div className="container-x">
        <SectionHeader id="casos-title" eyebrow={c.eyebrow} title={c.title} lead={c.lead} center />
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {CASES.map((cs, i) => (
            <li key={i} className="rounded-3xl border border-dashed border-line-strong bg-surface/40 p-7" data-reveal="" data-case-pending={cs ? undefined : ''}>
              <p className="font-mono text-xs font-semibold tracking-wider text-violet-soft">{cs ? `0${i + 1}` : c.pending}</p>
              <dl className="mt-6 space-y-4">
                {c.fields.map((f, k) => {
                  const val = cs ? [cs.sector, cs.challenge, cs.solution, cs.result][k] : null;
                  return (
                    <div key={f}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{f}</dt>
                      <dd className="mt-1.5">
                        {val ?? <span className="block h-3 w-[70%] rounded bg-white/[0.07]" aria-label="—" />}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-center gap-4 text-center" data-reveal="">
          <p className="font-display text-xl font-medium">{c.cta}</p>
          <CtaButton href="#contacto" cursor={t.cta.cursorBook}>{t.cta.primary}</CtaButton>
        </div>
      </div>
    </section>
  );
}
