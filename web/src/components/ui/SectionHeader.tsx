import type { ReactNode } from 'react';
import { SplitText } from './SplitText';

type Props = { id: string; eyebrow: string; title: string; titleAccent?: string; lead?: ReactNode; center?: boolean; className?: string };

export function SectionHeader({ id, eyebrow, title, titleAccent, lead, center, className = '' }: Props) {
  return (
    <header className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <p className="eyebrow" data-reveal="">{eyebrow}</p>
      <h2 id={id} className="h-section mt-4">
        <SplitText text={title} />
        {titleAccent && (<>{' '}<SplitText text={titleAccent} wordClassName="text-gradient" /></>)}
      </h2>
      {lead && <p className={`lead mt-5 ${center ? 'mx-auto' : ''} max-w-2xl`} data-reveal="">{lead}</p>}
    </header>
  );
}
