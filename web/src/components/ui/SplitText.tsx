import { createElement, Fragment } from 'react';

type Props = { text: string; as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'; className?: string; wordClassName?: string };

/** Divide el texto en palabras para animarlas (las palabras siguen siendo legibles por lectores de pantalla). */
export function SplitText({ text, as = 'span', className, wordClassName }: Props) {
  const words = text.split(' ');
  return createElement(
    as,
    { className, 'data-split': '' },
    words.map((w, i) => (
      <Fragment key={i}>
        <span className="split-word"><span className={`split-inner ${wordClassName ?? ''}`}>{w}</span></span>
        {i < words.length - 1 ? ' ' : null}
      </Fragment>
    )),
  );
}
