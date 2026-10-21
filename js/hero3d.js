import * as THREE from 'three';
import { symbolGeometry, makeRenderer, studioEnvironment, goldMaterial, bokeh, onVisible } from './three-common.js';

// Símbolo ANMAR em 3D no herói: dourado metálico, luz que segue o mouse,
// partículas em profundidade e rotação por arraste com inércia.
export function initHero(canvas) {
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  studioEnvironment(renderer, scene, 0.9);

  const root = new THREE.Group();
  scene.add(root);

  const mat = goldMaterial();
  const mesh = new THREE.Mesh(symbolGeometry({ width: 4.6 }), mat);
  const pivot = new THREE.Group();
  pivot.add(mesh);
  root.add(pivot);

  // Halo de luz atrás do símbolo
  const haloTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255,240,205,.9)'); grd.addColorStop(.4, 'rgba(230,205,150,.35)'); grd.addColorStop(1, 'rgba(230,205,150,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: haloTex, transparent: true, depthWrite: false, opacity: 0.75 }));
  halo.position.z = -1.6;
  root.add(halo);

  const dust = bokeh(220, [16, 9, 10]);
  scene.add(dust);

  // Luzes
  scene.add(new THREE.AmbientLight(0xfff4e0, 0.35));
  const key = new THREE.DirectionalLight(0xfff0d0, 2.4); key.position.set(4, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2a8, 2.2); rim.position.set(-5, 2, -4); scene.add(rim);
  const cursorLight = new THREE.PointLight(0xffffff, 18, 12, 1.6); cursorLight.position.set(0, 0, 3.5); scene.add(cursorLight);

  // Estado de interação
  const state = { mx: 0, my: 0, rotY: -0.35, rotX: 0.08, velY: 0, dragging: false, lastX: 0, scroll: 0, intro: 0 };
  const isMobile = matchMedia('(max-width: 700px)').matches;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // posição do símbolo: à direita no desktop, acima no mobile
    const portrait = w / h < 0.9;
    const aspect = w / h;
    root.position.set(portrait ? 0 : 1.6, portrait ? 1.5 : 0.05, 0);
    root.scale.setScalar(portrait ? Math.min(0.62, aspect * 0.92) : 0.88);
  }
  resize();
  addEventListener('resize', resize);

  addEventListener('pointermove', (e) => {
    state.mx = (e.clientX / innerWidth) * 2 - 1;
    state.my = -(e.clientY / innerHeight) * 2 + 1;
    if (state.dragging) {
      const dx = e.clientX - state.lastX;
      state.velY = dx * 0.006;
      state.rotY += state.velY;
      state.lastX = e.clientX;
    }
  });
  canvas.addEventListener('pointerdown', (e) => {
    state.dragging = true; state.lastX = e.clientX;
    canvas.setPointerCapture?.(e.pointerId);
  });
  addEventListener('pointerup', () => (state.dragging = false));

  let running = true;
  onVisible(canvas, (v) => (running = v));

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();

    if (!state.dragging) {
      state.velY *= 0.95;
      state.rotY += state.velY + 0.0022; // giro lento contínuo
    }
    const scrollTurn = state.scroll * Math.PI * 0.9;
    pivot.rotation.y += ((state.rotY + scrollTurn + state.mx * 0.25) - pivot.rotation.y) * 0.08;
    pivot.rotation.x += ((state.rotX - state.my * 0.18 + state.scroll * 0.4) - pivot.rotation.x) * 0.08;
    pivot.position.y = Math.sin(t * 0.9) * 0.08 + state.scroll * 1.2;
    pivot.position.z = -state.scroll * 3;
    const s = THREE.MathUtils.lerp(0.6, 1, state.intro);
    pivot.scale.setScalar(s);
    mat.opacity = 1;

    halo.material.opacity = 0.55 + Math.sin(t * 1.3) * 0.12;
    halo.position.x = state.mx * 0.3;
    halo.position.y = state.my * 0.2;

    cursorLight.position.x += ((state.mx * 4) - cursorLight.position.x) * 0.1;
    cursorLight.position.y += ((state.my * 2.6) - cursorLight.position.y) * 0.1;

    dust.userData.tick(t);
    dust.position.x = -state.mx * 0.25;
    dust.position.y = -state.my * 0.15 + state.scroll * 1.5;

    camera.position.x += ((state.mx * 0.35) - camera.position.x) * 0.05;
    camera.position.y += ((state.my * 0.2) - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  frame();

  return {
    setScroll: (p) => (state.scroll = p),
    setIntro: (p) => (state.intro = p),
    isMobile,
  };
}
