import { useRef, type ReactNode } from 'react';
import { useTilt } from './hooks';

type Props = { children: ReactNode; className?: string; as?: 'div' | 'li' | 'article'; tilt?: number; cursor?: string };

export function Card({ children, className = '', as: Tag = 'div', tilt = 6, cursor }: Props) {
  const ref = useRef<HTMLElement>(null);
  useTilt(ref, tilt);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`card ${className}`} data-reveal="" data-cursor={cursor}>
      {children}
    </Tag>
  );
}
