# ORBIXEL · Mini guía de marca

Abre `guia-de-marca.html` en el navegador para verla con ejemplos visuales.
Todos los archivos se regeneran con `cd web && npm run brand`.

## Concepto
Una «O» formada por una **órbita abierta**. En el hueco, la órbita se descompone en **píxeles**
y un píxel mayor hace de **satélite**: orb + pixel = ORBIXEL. Representa lo que hacemos:
primero entender el sistema completo (la órbita) y solo entonces actuar con tecnología (el píxel).

## Archivos
| Archivo | Uso |
|---|---|
| `logo/orbixel-logo-horizontal.svg` | Logotipo principal sobre fondo oscuro |
| `logo/orbixel-logo-horizontal-mono-claro.svg` | Una tinta, blanco, sobre fotos o fondos oscuros |
| `logo/orbixel-logo-horizontal-mono-oscuro.svg` | Una tinta, casi negro, sobre fondos claros, papelería |
| `logo/orbixel-isotipo.svg` (+ `-1024.png`) | Símbolo solo: avatar, redes, sellos |
| `logo/orbixel-isotipo-mono-claro.svg` / `-mono-oscuro.svg` | Símbolo a una tinta |
| `logo/orbixel-logo-horizontal-fondo-oscuro.png` / `-fondo-claro.png` | PNG rápidos para documentos |
| `favicon/favicon.svg`, `favicon-32.png`, `apple-touch-icon-180.png`, `icon-512.png` | Favicons |
| `og-image-1200x630.png` | Imagen para compartir en redes (Open Graph) |

El texto de los logotipos está convertido a trazados: no depende de tener la fuente instalada.

## Color
| Token | HEX | Uso |
|---|---|---|
| `bg` | `#05060A` | Fondo principal (casi negro) |
| `surface` | `#0B0D15` / `#11141F` | Tarjetas y paneles |
| `violet` | `#6C5CFF` | Acento eléctrico: botones principales, degradados |
| `violet-soft` | `#A69CFF` | Violeta para **texto** (el `#6C5CFF` no llega a AA en texto pequeño sobre negro) |
| `cyan` | `#22D3EE` | Secundario: detalles, foco, etiquetas |
| `fg` | `#F5F6FA` | Texto principal |
| `soft` | `#D3D6E3` | Texto de párrafo |
| `muted` | `#A3A8BD` | Texto secundario |

Degradado de marca: `#6C5CFF → #22D3EE` a 135°.
Contrastes comprobados sobre `#05060A`: blanco 19:1 · `muted` 8,6:1 · `cyan` 11:1 · `violet-soft` 8,5:1 · texto blanco `#FFFFFF` sobre botón `#6C5CFF` 4,6:1 (AA).

## Tipografía
- **Space Grotesk** (títulos y logotipo), 600–700, interletrado −0,025 em.
- **Inter** (texto), 400–600.
Ambas son libres (SIL OFL) y están autoalojadas en la web.

## Uso del logo
- Área de respeto: la altura del satélite (≈ 18 % de la altura del símbolo) por cada lado.
- Tamaño mínimo: logotipo horizontal 24 px de alto en pantalla (18 mm impreso); símbolo 16 px.
- Por debajo de 480 px de ancho de pantalla usa el símbolo solo.
- No: deformar, rotar el logotipo, cambiar los colores del degradado, poner el logo en color sobre fondos claros
  (usa la versión mono oscura), añadir sombras o contornos, separar «Agency» de «ORBIXEL».
- Animación: la órbita puede girar y los píxeles ensamblarse (loader y hero). Siempre con alternativa estática
  para quien tiene activado «reducir movimiento».

## Tono de voz
Frases cortas. Cercano y profesional. Hablamos del resultado para el negocio, no de la tecnología.
Frase de marca: «Primero entendemos tu empresa. Después decidimos qué necesita. Y solo entonces usamos la tecnología.»
