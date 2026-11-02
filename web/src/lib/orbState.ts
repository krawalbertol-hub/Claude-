// Estado compartido del orbe 3D. GSAP (scroll) escribe aquí y el render loop de Three lee cada frame.
// Pesos de forma: esfera, caos (descompuesto), rejilla de píxeles y anillo orbital. Deben sumar ≈ 1.
export const orbState = {
  sphere: 1,
  chaos: 0,
  grid: 0,
  ring: 0,
  x: 0, // desplazamiento horizontal en unidades de mundo
  y: 0,
  scale: 1,
  opacity: 1,
  intro: 0, // 0 → partículas dispersas al cargar, 1 → ensambladas
};
export type OrbState = typeof orbState;
