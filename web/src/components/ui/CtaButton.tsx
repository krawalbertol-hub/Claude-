import { useRef, type ReactNode, type MouseEvent } from 'react';
import { useMagnetic } from './hooks';
import { scrollToHash } from '../../lib/scroll';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  cursor?: string;
  className?: string;
  arrow?: boolean;
  external?: boolean;
  onClick?: () => void;
};

/** Enlace con aspecto de botón, efecto magnético y scroll suave a anclas. */
export function CtaButton({ href, children, variant = 'primary', cursor, className = '', arrow = true, external, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (href.startsWith('#')) { e.preventDefault(); scrollToHash(href); }
  };
  return (
    <a
      ref={ref}
      href={href}
      onClick={handle}
      data-cursor={cursor}
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span>{children}</span>
      {arrow && (
        <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </a>
  );
}
