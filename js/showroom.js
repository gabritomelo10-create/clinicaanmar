import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { symbolGeometry, wordmarkGeometry, makeRenderer, studioEnvironment, goldMaterial, bokeh, onVisible } from './three-common.js';
import * as T from './textures.js';

const gsap = window.gsap;

function tex(canvas, { repeat } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0, ...o });
const shadowy = (m) => { m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return m; };

function tween(target, vars) {
  if (gsap) return gsap.to(target, vars);
  Object.assign(target, vars); return null;
}

// ── Objetos ─────────────────────────────────────────────
function makeCard() {
  const g = new THREE.Group();
  const edge = std({ color: 0xf3ecdd });
  const geo = new THREE.BoxGeometry(3.6, 2, 0.03);
  const front = std({ map: tex(T.cardFront()), roughness: 0.65 });
  const back = std({ map: tex(T.cardBack()), roughness: 0.7 });
  const a = new THREE.Mesh(geo, [edge, edge, edge, edge, front, back]);
  a.position.set(0, 0.55, 0.2);
  a.rotation.set(-0.12, -0.35, 0.06);
  const b = new THREE.Mesh(geo, [edge, edge, edge, edge, back, front]);
  b.position.set(0.5, -0.62, -0.6);
  b.rotation.set(-Math.PI / 2 + 0.02, 0, 0.35);
  g.add(a, b);
  let flipped = false;
  return {
    group: shadowy(g), float: a, target: [0, 0.1, 0], dist: 6.8,
    name: 'Cartão de visita', desc: '90 × 50 mm · frente com camadas translúcidas, verso taupe.',
    action() { flipped = !flipped; tween(a.rotation, { y: flipped ? Math.PI - 0.35 : -0.35, duration: 1.2, ease: 'expo.inOut' }); },
  };
}

function makeNotebook() {
  const g = new THREE.Group();
  const W = 2.0, H = 2.84, TH = 0.22;
  const taupe = std({ color: 0x655b49, roughness: 0.75 });
  const coverMat = std({ map: tex(T.notebookCover()), roughness: 0.7 });
  const inside = std({ color: 0xf1e9da });
  const pageMat = std({ map: tex(T.notebookPage()), roughness: 0.9 });
  const pagesEdge = std({ color: 0xf8f3e8, roughness: 0.95 });
  const backCover = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.03), taupe);
  backCover.position.z = -TH / 2;
  const pages = new THREE.Mesh(new THREE.BoxGeometry(W - 0.06, H - 0.08, TH - 0.05), [pagesEdge, pagesEdge, pagesEdge, pagesEdge, pageMat, pagesEdge]);
  pages.position.x = 0.02;
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.04, H, TH + 0.02), goldMaterial({ roughness: 0.4 }));
  spine.position.x = -W / 2;
  const pivot = new THREE.Group();
  pivot.position.set(-W / 2, 0, TH / 2);
  const cover = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.03), [taupe, taupe, taupe, taupe, coverMat, inside]);
  cover.position.x = W / 2;
  pivot.add(cover);
  const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.005), goldMaterial({ roughness: 0.5 }));
  ribbon.position.set(0.4, -H / 2 - 0.12, 0);
  const book = new THREE.Group();
  book.add(backCover, pages, spine, pivot, ribbon);
  book.position.y = 0.35;
  book.rotation.set(-0.12, 0.42, 0.04);
  g.add(book);
  let open = false;
  return {
    group: shadowy(g), float: book, target: [0, 0.3, 0], dist: 7.2,
    name: 'Caderno A5', desc: 'Capa com pattern tonal em taupe e assinatura marfim.',
    action() { open = !open; tween(pivot.rotation, { y: open ? -2.5 : 0, duration: 1.4, ease: 'expo.inOut' }); tween(book.rotation, { y: open ? 0.15 : 0.42, duration: 1.4, ease: 'expo.inOut' }); },
  };
}

function makeBottle() {
  const g = new THREE.Group();
  const label = std({ map: tex(T.bottleLabel()), roughness: 0.42 });
  label.metalness = 0.15;
  const plain = new THREE.MeshPhysicalMaterial({ color: 0x5f5644, roughness: 0.4, metalness: 0.2, clearcoat: 0.4 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 96, 1, false, -Math.PI, Math.PI * 2), [label, plain, plain]);
  const pts = [];
  for (let i = 0; i <= 16; i++) { const k = i / 16; pts.push(new THREE.Vector2(0.55 - 0.25 * Math.sin(k * Math.PI / 2) ** 1.5, 1.1 + k * 0.38)); }
  const shoulder = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), plain);
  const capMat = goldMaterial({ roughness: 0.32 });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.5, 64), capMat);
  cap.position.y = 1.72;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.025, 16, 64), capMat);
  ring.rotation.x = Math.PI / 2; ring.position.y = 1.5;
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 16, 48), capMat);
  loop.position.set(0, 2.05, 0);
  const bottle = new THREE.Group();
  bottle.add(body, shoulder, cap, ring, loop);
  bottle.position.y = 0.28;
  bottle.rotation.z = 0.04;
  g.add(bottle);
  return {
    group: shadowy(g), float: bottle, target: [0, 0.75, 0], dist: 7.8,
    name: 'Garrafa', desc: 'Área frontal 60 × 85 mm · base taupe, tampa dourada.',
    action() { tween(bottle.rotation, { y: bottle.rotation.y + Math.PI * 2, duration: 1.8, ease: 'expo.inOut' }); },
  };
}

function makeBadge() {
  const g = new THREE.Group();
  const W = 1.6, H = 2.55;
  const edge = std({ color: 0xf3ecdd });
  const card = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.03), [edge, edge, edge, edge,
    std({ map: tex(T.badgeFront()), roughness: 0.55 }), std({ map: tex(T.badgeBack()), roughness: 0.6 })]);
  const metal = goldMaterial({ roughness: 0.3 });
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.06), metal);
  clip.position.y = H / 2 + 0.05;
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 12, 32), metal);
  hook.position.y = H / 2 + 0.22;
  const hang = new THREE.Group();
  card.position.y = -H / 2 - 0.3;
  clip.position.y = -0.25; hook.position.y = -0.08;
  hang.add(card, clip, hook);
  hang.position.y = 1.55;

  const lanCanvas = document.createElement('canvas');
  lanCanvas.width = 2048; lanCanvas.height = 160;
  const lx = lanCanvas.getContext('2d');
  lx.translate(0, 160); lx.rotate(-Math.PI / 2);
  lx.drawImage(T.lanyard(), 0, 0, 160, 2048);
  const lt = tex(lanCanvas, { repeat: [2, 1] });
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.1, 4.6, -0.8), new THREE.Vector3(-0.5, 3, -0.1), new THREE.Vector3(0, 1.62, 0),
    new THREE.Vector3(0.5, 3, -0.1), new THREE.Vector3(1.1, 4.6, -0.8),
  ]);
  const strap = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.05, 12, false), std({ map: lt, roughness: 0.85 }));
  strap.scale.z = 0.35;
  const all = new THREE.Group();
  all.add(strap, hang);
  all.position.y = -0.55;
  all.scale.setScalar(0.78);
  g.add(all);
  let side = 0;
  return {
    group: shadowy(g), float: null, target: [0, 0.75, 0], dist: 8.6,
    name: 'Crachá e cordão', desc: 'Crachá 54 × 86 mm · cordão sublimado em taupe com marca marfim.',
    action() {
      side = side ? 0 : Math.PI;
      if (!gsap) { hang.rotation.y = side; return; }
      gsap.timeline()
        .to(hang.rotation, { y: side, duration: 1.2, ease: 'expo.inOut' }, 0)
        .to(hang.rotation, { z: 0.22, duration: 0.35, ease: 'sine.out' }, 0)
        .to(hang.rotation, { z: -0.15, duration: 0.6, ease: 'sine.inOut' })
        .to(hang.rotation, { z: 0.07, duration: 0.6, ease: 'sine.inOut' })
        .to(hang.rotation, { z: 0, duration: 0.6, ease: 'sine.inOut' });
    },
  };
}

function makeFacade(lights) {
  const g = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.BoxGeometry(10, 4.8, 0.2), std({ map: tex(T.facadeWall()), roughness: 0.95 }));
  wall.position.set(0, 1.6, -0.6);
  wall.receiveShadow = true;
  const symMat = goldMaterial({ roughness: 0.28, emissive: 0x000000 });
  const sym = new THREE.Mesh(symbolGeometry({ width: 2.7, depth: 70, bevel: 6 }), symMat);
  sym.position.set(0, 2.15, -0.25);
  const word = new THREE.Mesh(wordmarkGeometry({ width: 2.7, depth: 40 }), std({ color: 0xefe6d4, roughness: 0.45, metalness: 0.1 }));
  word.position.set(0, 1.13, -0.38);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 4), new THREE.MeshBasicMaterial({ map: tex(T.glowTexture()), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.position.set(0, 1.75, -0.49);
  const sill = new THREE.Mesh(new THREE.BoxGeometry(10, 0.12, 0.6), std({ color: 0x8a7f6a, roughness: 0.9 }));
  sill.position.set(0, -0.76, -0.3);
  g.add(wall, glow, sym, word, sill);
  shadowy(g);
  wall.castShadow = false; glow.castShadow = false;
  let night = false;
  return {
    group: g, float: null, target: [0, 1.45, 0], dist: 10.5,
    name: 'Fachada · letra-caixa', desc: 'Logo em recorte 1000 mm. Clique para acender a iluminação noturna.',
    action() {
      night = !night;
      tween(glow.material, { opacity: night ? 0.9 : 0, duration: 1.2 });
      tween(symMat.emissive, { r: night ? 0.35 : 0, g: night ? 0.26 : 0, b: night ? 0.1 : 0, duration: 1.2 });
      lights.night(night);
    },
  };
}

// ── Cena ────────────────────────────────────────────────
export async function initShowroom({ canvas, tabs, nameEl, descEl, loadingEl }) {
  try { await document.fonts.load('italic 44px "Libre Baskerville"'); } catch (e) { /* segue com fallback */ }

  const renderer = makeRenderer(canvas);
  renderer.toneMappingExposure = 0.82;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  studioEnvironment(renderer, scene, 0.45);
  scene.fog = new THREE.Fog(0x221e18, 14, 30);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(2.2, 1.6, 6.8);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 13;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.53;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;
  controls.target.set(0, 0.3, 0);
  // não sequestrar a rolagem da página: zoom só com Ctrl/pinça
  controls.enableZoom = false;
  canvas.addEventListener('wheel', (e) => { if (e.ctrlKey) { controls.enableZoom = true; } else { controls.enableZoom = false; } }, { passive: true });

  let idleTimer;
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(idleTimer); });
  controls.addEventListener('end', () => { idleTimer = setTimeout(() => (controls.autoRotate = true), 5000); });

  // Luzes
  const ambient = new THREE.AmbientLight(0xfff1dc, 0.45);
  const key = new THREE.DirectionalLight(0xfff0d6, 2);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -6; key.shadow.camera.right = 6; key.shadow.camera.top = 6; key.shadow.camera.bottom = -6;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 6;
  const rim = new THREE.DirectionalLight(0xffd99a, 1.6); rim.position.set(-5, 3, -4);
  const spotL = new THREE.SpotLight(0xffe0a8, 0, 12, 0.5, 0.6, 1.2); spotL.position.set(-2.2, 4.8, 1.5); spotL.target.position.set(-0.6, 1.6, -0.5); spotL.castShadow = true;
  const spotR = spotL.clone(); spotR.position.set(2.2, 4.8, 1.5); spotR.target = new THREE.Object3D(); spotR.target.position.set(0.6, 1.6, -0.5);
  scene.add(ambient, key, rim, spotL, spotL.target, spotR, spotR.target);
  const lights = {
    night(on) {
      tween(ambient, { intensity: on ? 0.05 : 0.45, duration: 1.2 });
      tween(scene, { environmentIntensity: on ? 0.12 : 0.45, duration: 1.2 });
      tween(key, { intensity: on ? 0.2 : 2, duration: 1.2 });
      tween(spotL, { intensity: on ? 60 : 0, duration: 1.2 });
      tween(spotR, { intensity: on ? 60 : 0, duration: 1.2 });
    },
  };

  // Piso: sombra suave + halo
  const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.35 }));
  shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.position.y = -0.8; shadowFloor.receiveShadow = true;
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshBasicMaterial({ map: tex(T.floorTexture()), transparent: true, depthWrite: false }));
  halo.rotation.x = -Math.PI / 2; halo.position.y = -0.799;
  scene.add(shadowFloor, halo);
  const dust = bokeh(120, [16, 8, 12]);
  dust.position.y = 1.2;
  scene.add(dust);

  const items = [makeCard(), makeNotebook(), makeBottle(), makeBadge(), makeFacade(lights)];
  items.forEach((it) => { it.group.visible = false; it.group.scale.setScalar(0.001); scene.add(it.group); });

  let current = -1;
  function show(i) {
    if (i === current) return;
    const prev = items[current];
    if (prev) {
      const pg = prev.group;
      if (gsap) gsap.to(pg.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.5, ease: 'expo.in', onComplete: () => (pg.visible = false) });
      else pg.visible = false;
      if (prev.name.startsWith('Fachada')) lights.night(false);
    }
    current = i;
    const it = items[i];
    it.group.visible = true;
    if (gsap) {
      gsap.fromTo(it.group.scale, { x: 0.001, y: 0.001, z: 0.001 }, { x: 1, y: 1, z: 1, duration: 1.1, delay: prev ? 0.35 : 0, ease: 'expo.out' });
      gsap.fromTo(it.group.rotation, { y: -0.8 }, { y: 0, duration: 1.4, delay: prev ? 0.35 : 0, ease: 'expo.out' });
      gsap.to(controls.target, { x: it.target[0], y: it.target[1], z: it.target[2], duration: 1.2, ease: 'expo.inOut' });
      const dir = camera.position.clone().sub(controls.target).normalize();
      const p = new THREE.Vector3(...it.target).add(dir.multiplyScalar(it.dist));
      gsap.to(camera.position, { x: p.x, y: Math.max(p.y, it.target[1] + 0.6), z: p.z, duration: 1.2, ease: 'expo.inOut' });
    } else {
      it.group.scale.setScalar(1);
    }
    nameEl.textContent = it.name;
    descEl.textContent = it.desc;
    [...tabs.children].forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
  }

  items.forEach((it, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.textContent = it.name.split(' · ')[0].replace(' e cordão', '');
    b.addEventListener('click', () => show(i));
    tabs.appendChild(b);
  });

  // Clique no objeto → interação
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downAt = null;
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.intersectObject(items[current].group, true).length > 0;
  };
  canvas.addEventListener('pointerdown', (e) => (downAt = [e.clientX, e.clientY]));
  canvas.addEventListener('pointerup', (e) => {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
    downAt = null;
    if (moved < 6 && pick(e)) items[current].action();
  });
  canvas.addEventListener('pointermove', (e) => { canvas.dataset.cursor = pick(e) ? 'Clique' : 'Arraste'; });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 48 : 34;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  let running = false;
  onVisible(canvas, (v) => (running = v), '100px');
  const clock = new THREE.Clock();
  (function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();
    const it = items[current];
    if (it?.float) {
      it.float.position.y += (Math.sin(t * 1.1) * 0.0016);
    }
    dust.userData.tick(t);
    controls.update();
    renderer.render(scene, camera);
  })();

  show(0);
  loadingEl?.classList.add('is-done');
}
