import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SYMBOL_D, WORDMARK } from './brand-paths.js';

const loader = new SVGLoader();

function shapesFrom(d) {
  const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  return data.paths.flatMap((p) => SVGLoader.createShapes(p));
}

// Símbolo extrudado, centralizado e com largura = `width` unidades.
export function symbolGeometry({ width = 4, depth = 70, bevel = 9, curveSegments = 28 } = {}) {
  const geo = new THREE.ExtrudeGeometry(shapesFrom(SYMBOL_D), {
    depth, curveSegments, bevelEnabled: true,
    bevelThickness: bevel, bevelSize: bevel * 0.6, bevelSegments: 6,
  });
  geo.rotateX(Math.PI); // SVG tem Y para baixo
  geo.center();
  const s = width / 842;
  geo.scale(s, s, s);
  geo.computeVertexNormals();
  return geo;
}

// Letras ANMAR extrudadas (letra-caixa), mesma escala da assinatura completa.
export function wordmarkGeometry({ width = 4, depth = 30 } = {}) {
  const geos = WORDMARK.map((p) => {
    const g = new THREE.ExtrudeGeometry(shapesFrom(p.d), { depth, curveSegments: 10, bevelEnabled: true, bevelThickness: 3, bevelSize: 2, bevelSegments: 3 });
    g.translate(p.t[0], p.t[1], 0);
    return g;
  });
  const merged = mergeGeometries(geos);
  merged.rotateX(Math.PI);
  merged.center();
  const s = width / 842;
  merged.scale(s, s, s);
  merged.computeVertexNormals();
  return merged;
}

export function makeRenderer(canvas, { alpha = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  return renderer;
}

export function studioEnvironment(renderer, scene, intensity = 1) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = intensity;
  pmrem.dispose();
  return env;
}

export const goldMaterial = (opts = {}) => new THREE.MeshPhysicalMaterial({
  color: 0xc8a96b, metalness: 1, roughness: 0.26,
  clearcoat: 0.7, clearcoatRoughness: 0.18, ...opts,
});

// Partículas “bokeh”: discos suaves em profundidades diferentes (sensação de profundidade de campo).
export function bokeh(count = 160, spread = [14, 8, 10], color = 0xe9d6a8) {
  const tex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.35, 'rgba(255,255,255,.55)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const group = new THREE.Group();
  const layers = [
    { n: Math.round(count * 0.6), size: 0.06, opacity: 0.85, z: [-6, 0] },
    { n: Math.round(count * 0.3), size: 0.18, opacity: 0.35, z: [0, 3] },
    { n: Math.round(count * 0.1), size: 0.55, opacity: 0.16, z: [3, 6] },
  ];
  for (const l of layers) {
    const pos = new Float32Array(l.n * 3);
    for (let i = 0; i < l.n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread[0];
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      pos[i * 3 + 2] = l.z[0] + Math.random() * (l.z[1] - l.z[0]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: l.size, map: tex, color, transparent: true, opacity: l.opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    pts.userData.speed = 0.02 + Math.random() * 0.03;
    group.add(pts);
  }
  group.userData.tick = (t) => {
    group.children.forEach((p, i) => {
      p.position.y = Math.sin(t * p.userData.speed * 6 + i) * 0.25;
      p.rotation.z = t * p.userData.speed * 0.4;
    });
  };
  return group;
}

export function onVisible(el, cb, rootMargin = '0px') {
  const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin });
  io.observe(el);
  return io;
}
