import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { HeroModelState } from './heroModelState';

/**
 * The home hero's model: a brutalist tower of stacked, cantilevered concrete boxes (one for each
 * part of life), crowned by an open frame (the aperture) and climbed by a stair (a flowing line of
 * movement). The boxes start scattered at the edges of the screen and gather into the tower as
 * the hero scrolls; the stair then builds from the ground up. The hero's timeline drives `state`.
 */

interface Props {
  state: React.MutableRefObject<HeroModelState>;
  /** Draw a single frame and never animate (reduced motion) */
  still?: boolean;
  onReady?: () => void;
  onFail?: () => void;
}

type V3 = [number, number, number];

interface Part {
  /** Assembled centre, in tower units (y up, ground at 0) */
  at: V3;
  /** Where it floats while the tower is apart, relative to the screen (not the turning tower) */
  away: V3;
  /** Its tumble while apart: x, y, z rotation in radians */
  tumble: V3;
  build: (concrete: THREE.Material, timber: THREE.Material, recess: THREE.Material) => THREE.Object3D;
  drift?: 'rise' | 'slide';
}

// World-scaled UVs, so the board marks keep one size on every face of every box
const TILE = 2.4;
let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const concreteBox = (w: number, h: number, d: number) => {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  const faces: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  const ou = rand(), ov = rand();
  faces.forEach(([su, sv], f) => {
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * su) / TILE + ou, (uv.getY(i) * sv) / TILE + ov);
    }
  });
  return g;
};

const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
  const o = new THREE.Mesh(g, m);
  o.position.set(x, y, z);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
};

/** A slatted timber window set into a box's front face */
const slatWindow = (w: number, h: number, slats: number, timber: THREE.Material, recess: THREE.Material) => {
  const g = new THREE.Group();
  g.add(mesh(new THREE.BoxGeometry(w, h, 0.04), recess));
  const slat = new THREE.BoxGeometry(0.06, h * 0.96, 0.09);
  for (let i = 0; i < slats; i++) g.add(mesh(slat, timber, -w / 2 + (w / slats) * (i + 0.5), 0, 0.04));
  return g;
};

const box = (w: number, h: number, d: number) => (c: THREE.Material) => mesh(concreteBox(w, h, d), c);

const PARTS: Part[] = [
  // Two piers lift the tower off its podium
  { at: [-0.7, 1.925, -0.1], away: [-11, 0.4, 1], tumble: [0.2, 0.5, -0.3], build: box(0.9, 3.35, 0.9) },
  { at: [1.0, 1.9, -0.7], away: [7, -3, -1], tumble: [-0.25, -0.4, 0.2], build: box(0.7, 3.3, 0.7) },
  // The core all the boxes hang from
  { at: [0.1, 5.5, -0.4], away: [-4, 10.5, -6], tumble: [0.3, 0.6, 0.1], build: box(1.7, 3.8, 1.7) },
  // A long cantilever to the left, with a slatted window
  {
    at: [-1.9, 4.6, 0.2], away: [-9, 2.8, 2], tumble: [0.15, -0.6, 0.2],
    build: (c, t, r) => {
      const g = new THREE.Group();
      g.add(mesh(concreteBox(4.2, 2.0, 2.6), c));
      const win = slatWindow(2.2, 0.8, 12, t, r);
      win.position.set(-0.75, 0.05, 1.31);
      g.add(win);
      return g;
    },
  },
  // A low slab reaching right, over the stair
  { at: [1.6, 4.0, 0.4], away: [9, -2.6, 1], tumble: [-0.2, 0.45, -0.15], build: box(4.4, 0.9, 2.4), drift: 'slide' },
  // A deeper box to the right
  { at: [1.4, 6.1, 0.3], away: [8.5, 2.6, -1], tumble: [0.25, -0.35, 0.2], build: box(3.6, 1.3, 2.4) },
  // A thin plate that the top two pieces sit on
  { at: [0.7, 7.7, 0.3], away: [-8.5, 5, -2], tumble: [-0.3, 0.5, 0.1], build: box(3.4, 0.6, 2.0) },
  // The top box, with a small window
  {
    at: [-1.2, 9.1, 0], away: [-6.6, 7.8, 1], tumble: [0.2, 0.7, -0.2],
    build: (c, t, r) => {
      const g = new THREE.Group();
      g.add(mesh(concreteBox(2.8, 2.2, 2.4), c));
      const win = slatWindow(0.72, 0.8, 5, t, r);
      win.position.set(-0.55, 0.25, 1.21);
      g.add(win);
      return g;
    },
  },
  // The open frame: the aperture, crowning the tower
  {
    at: [1.9, 9.4, -0.1], away: [8, 5.6, 0], tumble: [-0.2, -0.6, 0.25], drift: 'rise',
    build: (c) => {
      const g = new THREE.Group();
      const W = 2.6, H = 2.8, T = 0.45, D = 0.8;
      g.add(mesh(concreteBox(W, T, D), c, 0, H / 2 - T / 2, 0));
      g.add(mesh(concreteBox(W, T, D), c, 0, -H / 2 + T / 2, 0));
      g.add(mesh(concreteBox(T, H - 2 * T, D), c, -W / 2 + T / 2, 0, 0));
      g.add(mesh(concreteBox(T, H - 2 * T, D), c, W / 2 - T / 2, 0, 0));
      return g;
    },
  },
];

// The stair winds up round a post from the podium to the slab, a quarter turn short of two
const STAIR = { steps: 20, axis: [2.0, 1.7] as [number, number], radius: 1.25, from: -1.8 * Math.PI, to: -0.5 * Math.PI, rise: 0.16 };

/** Board-marked concrete: pale, warm, with pores, faint form-board joints and tie holes */
const concreteTexture = () => {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i * 4] = 216 + n;
    img.data[i * 4 + 1] = 210 + n;
    img.data[i * 4 + 2] = 200 + n;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // Soft cloudy variation
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * S, y = Math.random() * S, r = 40 + Math.random() * 120;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const dark = Math.random() < 0.5;
    g.addColorStop(0, dark ? 'rgba(120,110,95,0.07)' : 'rgba(255,255,250,0.08)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }
  // Form-board joints
  for (let y = 0; y < S; y += S / 6) {
    ctx.fillStyle = 'rgba(90,82,70,0.10)';
    ctx.fillRect(0, y, S, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillRect(0, y + 2, S, 1);
  }
  // Pores
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = `rgba(70,64,55,${0.15 + Math.random() * 0.3})`;
    const r = Math.random() * 1.4 + 0.3;
    ctx.beginPath();
    ctx.arc(Math.random() * S, Math.random() * S, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Tie holes on a grid
  for (let x = S / 8; x < S; x += S / 4) {
    for (let y = S / 12; y < S; y += S / 3) {
      ctx.fillStyle = 'rgba(60,55,48,0.35)';
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const HeroTower: React.FC<Props> = ({ state, still = false, onReady, onFail }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cb = useRef({ onReady, onFail });
  cb.current = { onReady, onFail };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      cb.current.onFail?.();
      return;
    }
    const narrow = window.matchMedia('(max-width: 767px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.className = 'block size-full';
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.22;
    scene.add(new THREE.HemisphereLight(0xf5f1ea, 0xb4ada1, 1.0));

    // A low, warm sun from the front left, so every cantilever throws a long shadow
    const sun = new THREE.DirectionalLight(0xffe6c8, 2.9);
    sun.position.set(-12, 15, 12);
    sun.target.position.set(0, 4, 0);
    sun.castShadow = true;
    sun.shadow.mapSize.setScalar(narrow ? 1024 : 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 14, bottom: -8, near: 1, far: 70 });
    scene.add(sun, sun.target);

    // The page itself is the ground: only the shadows are drawn on it
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ color: 0x1d201e, opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const concreteMap = concreteTexture();
    concreteMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const concrete = new THREE.MeshStandardMaterial({ map: concreteMap, roughness: 0.92, metalness: 0 });
    const timber = new THREE.MeshStandardMaterial({ color: 0x9a6744, roughness: 0.62, metalness: 0 });
    const recess = new THREE.MeshStandardMaterial({ color: 0x2c2622, roughness: 1, metalness: 0 });

    // Podium and stair turn with the tower; the boxes are placed by hand each frame
    const turning = new THREE.Group();
    scene.add(turning);
    turning.add(mesh(concreteBox(8.5, 0.25, 7.5), concrete, 0.4, 0.125, 0.6));

    const stepGeo = concreteBox(1.15, 0.2, 0.46);
    const steps = new THREE.InstancedMesh(stepGeo, concrete, STAIR.steps);
    steps.castShadow = steps.receiveShadow = true;
    steps.frustumCulled = false;
    turning.add(steps);
    const postGeo = concreteBox(0.36, 1, 0.36);
    const post = mesh(postGeo, concrete, STAIR.axis[0], 0.25, STAIR.axis[1]);
    turning.add(post);

    const parts = PARTS.map((p) => {
      const o = p.build(concrete, timber, recess);
      scene.add(o);
      return { ...p, o, at: new THREE.Vector3(...p.at), away: new THREE.Vector3(...p.away) };
    });

    const camera = new THREE.PerspectiveCamera(24, 1, 0.5, 300);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const tmp = new THREE.Vector3();
    const local = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();

    const layout = (time: number) => {
      const { assemble, stair } = state.current;
      const spin = -0.6 + (still ? 0 : (time / 90) * Math.PI * 2);
      turning.rotation.y = spin;

      const n = parts.length;
      parts.forEach((part, i) => {
        // Each box sets off a little after the one before, lowest first
        const k = ease(clamp01((assemble - i * 0.075) / (1 - 0.075 * (n - 1))));
        local.copy(part.at);
        if (part.drift === 'rise') local.y += (Math.sin((time / 11) * Math.PI * 2) * 0.5 + 0.5) * 0.3 * k;
        if (part.drift === 'slide') local.x += Math.sin((time / 9) * Math.PI * 2 + 1) * 0.35 * k;
        local.applyAxisAngle(up, spin);
        tmp.copy(part.away);
        tmp.x *= spreadX;
        tmp.y += Math.sin(time * 0.5 + i * 1.7) * 0.3;
        part.o.position.lerpVectors(tmp, local, k);
        const loose = 1 - k;
        part.o.rotation.set(
          part.tumble[0] * loose + Math.sin(time * 0.4 + i) * 0.05 * loose,
          spin * k + part.tumble[1] * loose + time * 0.03 * loose,
          part.tumble[2] * loose,
        );
      });

      // The stair builds from the ground up, each step settling into place
      const span = STAIR.to - STAIR.from;
      for (let i = 0; i < STAIR.steps; i++) {
        const t = ease(clamp01(stair * STAIR.steps - i));
        const a = STAIR.from + (span * i) / (STAIR.steps - 1);
        p.set(STAIR.axis[0] + Math.cos(a) * STAIR.radius, 0.35 + STAIR.rise * i + (1 - t) * 0.6, STAIR.axis[1] + Math.sin(a) * STAIR.radius);
        q.setFromAxisAngle(up, -a);
        s.setScalar(Math.max(t, 0.0001));
        steps.setMatrixAt(i, m.compose(p, q, s));
      }
      steps.instanceMatrix.needsUpdate = true;
      const postH = Math.max(stair, 0.0001) * (STAIR.rise * STAIR.steps + 0.1);
      post.scale.y = postH;
      post.position.y = 0.25 + postH / 2;
    };

    const look = new THREE.Vector3();
    const place = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      // Fit the tower's height on wide screens and its width on narrow ones
      const dist = Math.max(41, 28 / aspect);
      const rise = state.current.rise;
      const el = -0.07 + rise * 0.32 + pointer.y * 0.03;
      const az = pointer.x * 0.06;
      look.set(-0.1, 5.4 + rise * 0.4, 0);
      camera.position.set(Math.sin(az) * Math.cos(el) * dist, look.y + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);
      camera.lookAt(look);
      camera.updateProjectionMatrix();
    };

    // On narrow screens the scattered boxes gather closer in, so they still frame the emblem
    let spreadX = 1;
    let visible = true;
    let raf = 0;
    let ready = false;
    const start = performance.now();

    const draw = (now: number) => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      const time = still ? 0 : (now - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      layout(time);
      place(w, h);
      renderer.render(scene, camera);
      if (!ready) { ready = true; cb.current.onReady?.(); }
    };
    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (still) { draw(performance.now()); return; }
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      spreadX = Math.min(1, Math.max(0.6, 0.45 + (w / h) * 0.35));
      kick();
    };

    // A slight lean towards the pointer, on devices that have one
    const fine = window.matchMedia('(pointer: fine)').matches;
    const onPointer = (ev: PointerEvent) => {
      pointer.tx = (ev.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = -(ev.clientY / window.innerHeight - 0.5) * 2;
    };
    if (fine && !still) window.addEventListener('pointermove', onPointer, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick(); });
    io.observe(mount);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      const geometries = new Set<THREE.BufferGeometry>();
      scene.traverse((o) => { const g = (o as THREE.Mesh).geometry; if (g) geometries.add(g); });
      geometries.forEach((g) => g.dispose());
      [concrete, timber, recess, ground.material as THREE.Material].forEach((x) => x.dispose());
      concreteMap.dispose();
      steps.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [state, still]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
};

export default HeroTower;
