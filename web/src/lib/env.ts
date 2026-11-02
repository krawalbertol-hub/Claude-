export const isBrowser = typeof window !== 'undefined';

export const prefersReducedMotion = () =>
  isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
  isBrowser && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const isSmallScreen = () => isBrowser && window.innerWidth < 768;

export function hasWebGL(): boolean {
  if (!isBrowser) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
