import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { orbState } from '../../lib/orbState';

/**
 * Orbe de píxeles. Cada partícula conoce su posición en 4 formas (esfera, caos, rejilla y anillo);
 * el scroll mezcla los pesos y el ratón repele las partículas cercanas.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec4 uW;          // pesos: esfera, caos, rejilla, anillo
  uniform vec3 uMouse;      // ratón en coordenadas de mundo (plano z = 0)
  uniform float uMouseForce;
  uniform float uAgitation;
  uniform float uIntro;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  attribute vec3 aChaos;
  attribute vec3 aGrid;
  attribute vec3 aRing;
  attribute vec4 aRand;
  varying vec3 vColor;
  varying float vAlpha;

  mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
  mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
  mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0., -s, c, 0., 0., 0., 1.); }

  void main() {
    // Esfera que respira y gira
    vec3 sph = rotY(uTime * 0.12) * rotX(0.35) * position;
    sph += normalize(position) * (sin(uTime * 0.9 + aRand.y * 6.2831) * 0.025 + sin(position.y * 5.0 + uTime * 1.6) * 0.05 * uAgitation);
    // Caos: deriva lenta
    vec3 cha = aChaos + vec3(sin(uTime * 0.25 + aRand.y * 6.0), cos(uTime * 0.2 + aRand.z * 6.0), 0.0) * 0.18;
    // Rejilla: suelo de píxeles inclinado con relieve tipo gráfico
    vec3 grd = rotX(-0.95) * aGrid;
    grd.y += sin(aGrid.x * 1.3 + uTime * 0.8) * 0.06;
    // Anillo: órbita que gira en su plano
    vec3 rng = rotZ(uTime * 0.18) * aRing;

    vec3 p = sph * uW.x + cha * uW.y + grd * uW.z + rng * uW.w;

    // Intro: los píxeles llegan desde fuera y se ensamblan
    float t = clamp(uIntro * 1.7 - aRand.w * 0.7, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    p = mix(aChaos * 2.4 + vec3(0.0, 0.0, 2.0), p, t);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Repulsión del cursor
    vec2 d = world.xy - uMouse.xy;
    float dist = length(d);
    float f = smoothstep(1.25, 0.0, dist) * uMouseForce;
    world.xy += normalize(d + 1e-4) * f * 0.55;
    world.z += f * 0.35;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aRand.x * 0.9) * uPixelRatio * (1.0 + f * 0.9) / -mv.z;

    vec3 violet = vec3(0.4235, 0.3608, 1.0);
    vec3 cyan = vec3(0.1333, 0.8275, 0.9333);
    float m = smoothstep(-1.6, 1.6, p.x * 0.55 - p.y * 0.75 + sin(uTime * 0.4 + aRand.z * 6.2831) * 0.35);
    vColor = mix(violet, cyan, m);
    vColor = mix(vColor, vec3(1.0), step(0.965, aRand.z) * 0.85 + f * 0.35);
    float depth = smoothstep(-2.2, 1.6, world.z);
    vAlpha = uOpacity * (0.3 + 0.55 * depth) * t;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = abs(gl_PointCoord - 0.5);
    float box = 1.0 - smoothstep(0.34, 0.5, max(c.x, c.y)); // píxel cuadrado con borde suave
    if (box < 0.01) discard;
    gl_FragColor = vec4(vColor * box, vAlpha * box);
  }
`;

function buildGeometry(count: number) {
  const sphere = new Float32Array(count * 3);
  const chaos = new Float32Array(count * 3);
  const grid = new Float32Array(count * 3);
  const ring = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const cols = Math.ceil(Math.sqrt(count / 3));
  const cell = 5.2 / cols;
  for (let i = 0; i < count; i++) {
    // Esfera de Fibonacci con algo de grosor
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const rad = 1.55 * (0.94 + Math.random() * 0.08);
    sphere.set([Math.cos(th) * r * rad, y * rad, Math.sin(th) * r * rad], i * 3);
    // Caos: nube amplia y aplanada
    const u = Math.random() * Math.PI * 2; const v = Math.acos(2 * Math.random() - 1);
    const cr = 1.4 + Math.pow(Math.random(), 0.6) * 3.6;
    chaos.set([Math.sin(v) * Math.cos(u) * cr * 1.4, Math.sin(v) * Math.sin(u) * cr * 0.8, Math.cos(v) * cr * 0.6], i * 3);
    // Rejilla: celdas con varias capas (píxeles con volumen) y barras de distinta altura
    const ci = i % (cols * cols); const layer = Math.floor(i / (cols * cols));
    const gx = (ci % cols) - cols / 2; const gz = Math.floor(ci / cols) - cols / 2;
    const h = (Math.sin(gx * 0.45) * Math.cos(gz * 0.38) * 0.5 + 0.5) * 0.9;
    grid.set([gx * cell, layer * (h / 3) + 0.02, gz * cell], i * 3);
    // Anillo orbital
    const a = Math.random() * Math.PI * 2; const tube = (Math.random() - 0.5) * 0.22; const tz = (Math.random() - 0.5) * 0.18;
    const rr = 1.9 + tube;
    ring.set([Math.cos(a) * rr, Math.sin(a) * rr, tz], i * 3);
    rand.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(sphere, 3));
  g.setAttribute('aChaos', new THREE.BufferAttribute(chaos, 3));
  g.setAttribute('aGrid', new THREE.BufferAttribute(grid, 3));
  g.setAttribute('aRing', new THREE.BufferAttribute(ring, 3));
  g.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
  return g;
}

function Orb({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => buildGeometry(count), [count]);
  const { camera, size, gl } = useThree();
  const pointer = useRef({ x: 0, y: 0, active: false, vel: 0, lx: 0, ly: 0 });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uW: { value: new THREE.Vector4(1, 0, 0, 0) },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uMouseForce: { value: 0 },
          uAgitation: { value: 0 },
          uIntro: { value: 0 },
          uSize: { value: 34 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 1 },
        },
      }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pointer.current;
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -(e.clientY / window.innerHeight) * 2 + 1;
      p.active = e.pointerType === 'mouse';
    };
    const onLeave = () => { pointer.current.active = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => { window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); };
  }, []);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  const tmp = useMemo(() => ({ v: new THREE.Vector3(), dir: new THREE.Vector3() }), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const s = orbState;
    const dt = Math.min(delta, 0.05);
    u.uTime.value += dt;
    u.uW.value.set(s.sphere, s.chaos, s.grid, s.ring);
    u.uIntro.value = s.intro;
    u.uOpacity.value = s.opacity;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uSize.value = 34 * Math.min(1.35, Math.max(0.8, size.height / 900));

    // Ratón → plano z = 0
    const p = pointer.current;
    tmp.v.set(p.x, p.y, 0.5).unproject(camera);
    tmp.dir.copy(tmp.v).sub(camera.position).normalize();
    const dist = -camera.position.z / tmp.dir.z;
    const target = tmp.v.copy(camera.position).add(tmp.dir.multiplyScalar(dist));
    u.uMouse.value.lerp(target, 0.2);
    const speed = Math.hypot(p.x - p.lx, p.y - p.ly) / Math.max(dt, 0.001);
    p.lx = p.x; p.ly = p.y;
    p.vel += (Math.min(speed, 4) - p.vel) * 0.08;
    u.uMouseForce.value += ((p.active ? 0.75 + p.vel * 0.15 : 0) - u.uMouseForce.value) * 0.08;
    u.uAgitation.value += (Math.min(p.vel * 0.6, 1.2) - u.uAgitation.value) * 0.05;

    // Posición, escala y ligera inclinación hacia el ratón
    const o = points.current!;
    o.position.x += (s.x - o.position.x) * 0.12;
    o.position.y += (s.y - o.position.y) * 0.12;
    const sc = o.scale.x + (s.scale - o.scale.x) * 0.12;
    o.scale.setScalar(sc);
    const tilt = s.sphere + s.chaos;
    o.rotation.y += ((p.active ? p.x * 0.35 : 0) * tilt - o.rotation.y) * 0.05;
    o.rotation.x += ((p.active ? -p.y * 0.25 : 0) * tilt - o.rotation.x) * 0.05;
    state.invalidate();
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function OrbCanvas({ count, onReady }: { count: number; onReady?: () => void }) {
  return (
    <Canvas
      className="!fixed inset-0 !h-[100lvh] !w-full"
      style={{ position: 'fixed', pointerEvents: 'none' }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => requestAnimationFrame(() => onReady?.())}
      aria-hidden="true"
    >
      <Orb count={count} />
    </Canvas>
  );
}
