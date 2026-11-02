import { useId } from 'react';
import { ARC, PIXELS, SAT, WORD_D, AGENCY_D, LOGO_W } from './logoGeometry';

type SymbolProps = { animated?: boolean; spin?: boolean; className?: string; title?: string };

/** Isotipo: órbita abierta + píxeles que se desprenden + satélite. */
export function OrbixelSymbol({ animated = false, spin = false, className, title }: SymbolProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title} overflow="visible">
      <defs>
        <linearGradient id={`g${id}`} x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C5CFF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <g className={spin ? 'orbit-spin' : 'orbit-spin-hover'}>
        <path d={ARC} fill="none" stroke={`url(#g${id})`} strokeWidth="8" pathLength={1} className={animated ? 'loader-arc' : undefined} />
        <rect className={animated ? 'loader-px loader-px1' : undefined} x={PIXELS[0].x} y={PIXELS[0].y} width={PIXELS[0].s} height={PIXELS[0].s} rx={0.8} fill="#22D3EE" />
        <rect className={animated ? 'loader-px loader-px2' : undefined} x={PIXELS[1].x} y={PIXELS[1].y} width={PIXELS[1].s} height={PIXELS[1].s} rx={0.5} fill="#22D3EE" />
        <rect className={animated ? 'loader-px loader-sat' : undefined} x={SAT.x} y={SAT.y} width={SAT.s} height={SAT.s} rx={2.6} fill="#F5F6FA" />
      </g>
    </svg>
  );
}

/** Logotipo horizontal: símbolo + ORBIXEL + Agency (texto vectorizado, se lee bien a 24 px). */
export function OrbixelLogo({ className, label }: { className?: string; label?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={`0 0 ${LOGO_W} 64`} className={`logo-hover ${className ?? ''}`} role="img" aria-label={label ?? 'ORBIXEL Agency'} overflow="visible">
      <defs>
        <linearGradient id={`h${id}`} x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C5CFF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <g className="orbit-spin-hover">
        <path d={ARC} fill="none" stroke={`url(#h${id})`} strokeWidth="8" />
        {PIXELS.map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.s} height={p.s} rx={p.s * 0.18} fill="#22D3EE" />)}
        <rect x={SAT.x} y={SAT.y} width={SAT.s} height={SAT.s} rx={2.6} fill="#F5F6FA" />
      </g>
      <path d={WORD_D} fill="#F5F6FA" />
      <path d={AGENCY_D} fill="#A3A8BD" />
    </svg>
  );
}
