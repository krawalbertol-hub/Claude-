import { useRef, useState, type FormEvent } from 'react';
import { useI18n } from '../../i18n';
import { BASE, ROUTES, SITE, whatsappLink } from '../../config/site';
import { SplitText } from '../ui/SplitText';
import { Icon } from '../ui/Icon';
import { useMagnetic } from '../ui/hooks';

type Status = 'idle' | 'sending' | 'ok' | 'error';
type Errors = Partial<Record<'name' | 'business' | 'contact' | 'privacy', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{9,}$/;

export function ContactForm() {
  const { t, lang } = useI18n();
  const c = t.contact;
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const submitRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  useMagnetic(submitRef, 0.2);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const errs: Errors = {};
    if (!String(fd.get('nombre') ?? '').trim()) errs.name = c.required;
    if (!String(fd.get('negocio') ?? '').trim()) errs.business = c.required;
    const contact = String(fd.get('contacto') ?? '').trim();
    if (!contact) errs.contact = c.required;
    else if (!EMAIL.test(contact) && !PHONE.test(contact)) errs.contact = c.invalidContact;
    if (!fd.get('privacidad')) errs.privacy = c.privacyRequired;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      const map: Record<string, string> = { name: 'f-nombre', business: 'f-negocio', contact: 'f-contacto', privacy: 'f-privacidad' };
      document.getElementById(map[first])?.focus();
      return;
    }
    if (fd.get('bot-field')) return; // honeypot
    setStatus('sending');
    fd.set('idioma', lang);
    fd.set('comunicaciones', fd.get('comunicaciones') ? 'si' : 'no');
    try {
      const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
      const res = endpoint
        ? await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
        : await fetch(BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(fd as unknown as Record<string, string>).toString(),
          });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const err = (k: keyof Errors) =>
    errors[k] ? <p id={`e-${k}`} className="mt-1.5 text-sm text-danger">{errors[k]}</p> : null;

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative py-24 md:py-36" data-section="contact">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/60 to-transparent" />
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="min-w-0">
          <p className="eyebrow" data-reveal="">{c.eyebrow}</p>
          <h2 id="contacto-title" className="mt-4 text-[clamp(2.4rem,1.2rem+4.6vw,5rem)] font-bold leading-[1]">
            <SplitText text={c.title} />
          </h2>
          <p className="lead mt-6 max-w-md" data-reveal="">{c.lead}</p>
          <div className="mt-10 space-y-3" data-reveal="">
            <p className="text-sm text-muted">{c.or}</p>
            <div className="flex flex-col items-start gap-3">
              <a href={whatsappLink(c.whatsappText)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !justify-start" data-cursor="WhatsApp">
                <Icon name="whatsapp" className="size-5 text-[#25D366]" />
                {c.whatsapp}
                <span className="sr-only"> {t.a11y.external}</span>
              </a>
              <a href={`mailto:${SITE.email}`} className="btn btn-ghost !justify-start max-[400px]:!whitespace-normal max-[400px]:break-all" data-cursor="">
                <Icon name="mail" className="size-5 text-cyan" />
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        <form
          name="contacto"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          noValidate
          onSubmit={onSubmit}
          className="min-w-0 rounded-3xl border border-line bg-surface/70 p-5 backdrop-blur-xl sm:p-8 md:p-10"
          data-reveal=""
        >
          <input type="hidden" name="form-name" value="contacto" />
          <p className="hidden"><label>No rellenar: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="f-nombre" className="field-label">{c.name} <span aria-hidden="true" className="text-cyan">*</span></label>
              <input id="f-nombre" name="nombre" className="field" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
              {err('name')}
            </div>
            <div>
              <label htmlFor="f-negocio" className="field-label">{c.business} <span aria-hidden="true" className="text-cyan">*</span></label>
              <input id="f-negocio" name="negocio" className="field" autoComplete="organization" required aria-invalid={!!errors.business} aria-describedby={errors.business ? 'e-business' : undefined} />
              {err('business')}
            </div>
            <div>
              <label htmlFor="f-sector" className="field-label">{c.sector}</label>
              <select id="f-sector" name="sector" className="field" defaultValue="">
                <option value="" disabled>{c.sectorPlaceholder}</option>
                {c.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-contacto" className="field-label">{c.contact} <span aria-hidden="true" className="text-cyan">*</span></label>
              <input id="f-contacto" name="contacto" className="field" autoComplete="email" inputMode="email" required aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'e-contact' : undefined} />
              {err('contact')}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="f-mensaje" className="field-label">{c.message}</label>
              <textarea id="f-mensaje" name="mensaje" rows={4} className="field resize-y" placeholder={c.messagePlaceholder} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-start gap-3">
                <input id="f-privacidad" name="privacidad" type="checkbox" value="aceptada" className="check" required aria-invalid={!!errors.privacy} aria-describedby={errors.privacy ? 'e-privacy' : undefined} />
                <label htmlFor="f-privacidad" className="text-sm leading-relaxed text-soft">
                  {c.privacyA}<a href={ROUTES[lang].privacy} className="font-semibold text-fg underline decoration-cyan/60 underline-offset-4 hover:decoration-cyan">{c.privacyLink}</a>{c.privacyB}{' '}
                  <span aria-hidden="true" className="text-cyan">*</span>
                </label>
              </div>
              {err('privacy')}
            </div>
            <div className="flex items-start gap-3">
              <input id="f-comunicaciones" name="comunicaciones" type="checkbox" value="si" className="check" />
              <label htmlFor="f-comunicaciones" className="text-sm leading-relaxed text-soft">{c.marketing}</label>
            </div>
            <p className="rounded-xl bg-white/[0.03] p-4 text-xs leading-relaxed text-muted">{c.infoLayer}</p>
          </div>

          <button ref={submitRef} type="submit" disabled={status === 'sending'} className="btn btn-primary mt-7 w-full sm:w-auto disabled:opacity-60" data-cursor={t.cta.cursorBook}>
            {status === 'sending' ? c.sending : c.submit}
            <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <p ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className={`mt-5 text-sm ${status === 'ok' ? 'text-cyan' : status === 'error' ? 'text-danger' : 'sr-only'}`}>
            {status === 'ok' ? c.success : status === 'error' ? c.error : ''}
          </p>
        </form>
      </div>
    </section>
  );
}
