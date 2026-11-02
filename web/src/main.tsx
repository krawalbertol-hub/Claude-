import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App url={location.pathname} />
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

// Fin del loader: duración mínima breve para que la animación del logo se lea, nunca más de ~1,2 s.
const html = document.documentElement;
if (html.classList.contains('is-loading')) {
  const elapsed = performance.now();
  setTimeout(() => {
    html.classList.add('loader-done');
    window.dispatchEvent(new Event('orbixel:loaded'));
    try { sessionStorage.setItem('orbixel-loaded', '1'); } catch { /* */ }
    setTimeout(() => html.classList.remove('is-loading', 'loader-done'), 600);
  }, Math.max(0, 1150 - elapsed));
}
