import { renderToString } from 'react-dom/server';
import { App } from './App';
import { buildHead, allRoutes } from './seo';
import { resolveRoute, ROUTES, SITE } from './config/site';
import './styles/index.css';

export function render(url: string) {
  return { html: renderToString(<App url={url} />), head: buildHead(url), lang: resolveRoute(url).lang };
}

export { allRoutes, ROUTES, SITE };
