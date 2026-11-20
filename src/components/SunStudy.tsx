import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '../context/SmoothScrollContext';

/**
 * A card-model courtyard house under the real sun for Wayanad (11.6° N).
 * Drag to turn it, move the slider through the day, switch the season.
 * Loaded on demand: three.js never reaches visitors who do not scroll this far.
 */

const LATITUDE = (11.6 * Math.PI) / 180;
const SEASONS = [
  { id: 'December', declination: -23.44 },
  { id: 'March', declination: 0 },
  { id: 'June', declination: 23.44 },
] as const;
type SeasonId = (typeof SEASONS)[number]['id'];

/** Sun direction as (east, up, north) for a solar hour and declination in degrees. */
const sunVector = (hour: number, declinationDeg: number) => {
  const d = (declinationDeg * Math.PI) / 180;
  const h = ((hour - 12) * 15 * Math.PI) / 180;
  return {
    east: -Math.cos(d) * Math.sin(h),
    north: Math.cos(LATITUDE) * Math.sin(d) - Math.sin(LATITUDE) * Math.cos(d) * Math.cos(h),
    up: Math.sin(LATITUDE) * Math.sin(d) + Math.cos(LATITUDE) * Math.cos(d) * Math.cos(h),
  };
};

const formatHour = (hour: number) => {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

const COLORS = {
  wall: 0xf6f5f1,
  plinth: 0xd9d8d0,
  roof: 0x2a2f2b,
  floor: 0xc4c3ba,
  pool: 0x8d9a92,
  tree: 0x4b5b45,
  trunk: 0x6b6558,
  dark: 0x3a3f3b,
};

/** The hipped ring roof: outer eave, ridge and inner eave squares joined by eight slopes. */
const ringRoof = (outer: number, ridge: number, inner: number, eaveY: number, ridgeY: number) => {
  const sign = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const at = (half: number, y: number, i: number) => [sign[i][0] * half, y, sign[i][1] * half];
  const positions: number[] = [];
  const quad = (a: number[], b: number[], c: number[], d: number[]) => positions.push(...a, ...b, ...c, ...a, ...c, ...d);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    quad(at(outer, eaveY, i), at(outer, eaveY, j), at(ridge, ridgeY, j), at(ridge, ridgeY, i));
    quad(at(ridge, ridgeY, i), at(ridge, ridgeY, j), at(inner, eaveY, j), at(inner, eaveY, i));
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
};

const buildHouse = () => {
  const house = new THREE.Group();
  const mat = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0, ...extra });
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    house.add(mesh);
    return mesh;
  };

  const wall = mat(COLORS.wall);
  const dark = mat(COLORS.dark);

  // Plinth, with the courtyard floor and a pool set into it
  add(new THREE.BoxGeometry(13, 0.4, 13), mat(COLORS.plinth), 0, 0.2, 0);
  add(new THREE.BoxGeometry(4.6, 0.04, 4.6), mat(COLORS.floor), 0, 0.42, 0);
  add(new THREE.BoxGeometry(1.7, 0.03, 1.1), mat(COLORS.pool, { roughness: 0.3 }), 0.9, 0.455, -0.9);
  add(new THREE.BoxGeometry(2.2, 0.2, 0.9), mat(COLORS.plinth), 0, 0.1, 6.9); // entrance step, south

  // Outer and inner walls of the four wings
  const H = 2.5;
  const y = 0.4 + H / 2;
  for (const [w, d, x, z] of [
    [12, 0.3, 0, -5.85], [12, 0.3, 0, 5.85], [0.3, 12, -5.85, 0], [0.3, 12, 5.85, 0],
    [7.1, 0.25, 0, -3.42], [7.1, 0.25, 0, 3.42], [0.25, 7.1, -3.42, 0], [0.25, 7.1, 3.42, 0],
  ]) add(new THREE.BoxGeometry(w, H, d), wall, x, y, z);

  // Openings: the door on the south face, windows around, doorways onto the veranda
  add(new THREE.BoxGeometry(1.3, 2.0, 0.34), dark, 0, 1.4, 5.85);
  for (const x of [-3.6, 3.6]) {
    add(new THREE.BoxGeometry(1.5, 1.0, 0.34), dark, x, 1.75, 5.85);
    add(new THREE.BoxGeometry(1.5, 1.0, 0.34), dark, x, 1.75, -5.85);
    add(new THREE.BoxGeometry(0.34, 1.0, 1.5), dark, 5.85, 1.75, x);
    add(new THREE.BoxGeometry(0.34, 1.0, 1.5), dark, -5.85, 1.75, x);
  }
  for (const [w, d, x, z] of [[1.1, 0.29, 0, 3.42], [1.1, 0.29, 0, -3.42], [0.29, 1.1, 3.42, 0], [0.29, 1.1, -3.42, 0]]) {
    add(new THREE.BoxGeometry(w, 1.9, d), dark, x, 1.35, z);
  }

  // Veranda columns around the courtyard
  const column = new THREE.CylinderGeometry(0.09, 0.09, 2.5, 12);
  for (const x of [-2.5, 0, 2.5]) for (const z of [-2.5, 0, 2.5]) {
    if (x !== 0 || z !== 0) add(column, wall, x, y, z);
  }

  // Roof: deep eaves outside, sloping in toward the open court
  add(ringRoof(7.05, 4.65, 2.25, 2.9, 4.45), mat(COLORS.roof, { side: THREE.DoubleSide, roughness: 0.85 }));

  // A tree growing up through the opening
  add(new THREE.CylinderGeometry(0.09, 0.13, 3.1, 8), mat(COLORS.trunk), -0.7, 1.95, 0.6);
  add(new THREE.IcosahedronGeometry(1.25, 1), mat(COLORS.tree, { flatShading: true }), -0.7, 4.3, 0.6);
  add(new THREE.IcosahedronGeometry(0.8, 1), mat(COLORS.tree, { flatShading: true }), 0.1, 3.7, 0.2);

  return house;
};

/** A flat north arrow with its letter, drawn on the ground. */
const northMark = () => {
  const group = new THREE.Group();
  const ink = new THREE.MeshBasicMaterial({ color: 0x5f645e });
  const shaft = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 1.6), ink);
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.32); shape.lineTo(0.16, 0); shape.lineTo(-0.16, 0); shape.closePath();
  const head = new THREE.Mesh(new THREE.ShapeGeometry(shape), ink);
  head.position.y = 0.8;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#5f645e';
  ctx.font = '400 62px "Hanken Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('N', 48, 52);
  const letter = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.9),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }),
  );
  letter.position.y = 1.75;
  group.add(shaft, head, letter);
  group.rotation.x = -Math.PI / 2; // lay flat; +y of the mark now points to -z, which is north
  group.position.set(-9.2, 0.02, 7.4);
  return group;
};

const FRAME_FADE =
  "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent)";

export const SunStudy: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hour, setHour] = useState(15.5);
  const [season, setSeason] = useState<SeasonId>('December');
  const [failed, setFailed] = useState(false);
  const [touched, setTouched] = useState(false);
  const target = useRef({ hour, declination: SEASONS[0].declination as number });
  const wake = useRef<() => void>(() => {});

  const declination = SEASONS.find((s) => s.id === season)!.declination;
  useEffect(() => {
    target.current = { hour, declination };
    wake.current();
  }, [hour, declination]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    const canvas = renderer.domElement;
    canvas.className = 'block size-full cursor-grab active:cursor-grabbing outline-offset-4';
    canvas.style.touchAction = 'pan-y'; // vertical swipes still scroll the page
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'A model of a courtyard house. Drag, or use the left and right arrow keys, to turn it.');
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.add(buildHouse(), northMark());

    // The page itself is the ground: only the shadows are drawn on it
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ color: 0x1d201e, opacity: 0.2 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9c8c0, 1.5));
    const sun = new THREE.DirectionalLight(0xfff4e2, 2.4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 120 });
    scene.add(sun, sun.target);

    // An axonometric view, as a model would be drawn
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    const view = { theta: 0.62, phi: 0.6, thetaTo: 0.62, phiTo: 0.6 };
    const now = { ...target.current };
    let auto = !prefersReducedMotion();
    let visible = true;
    let dirty = true;
    let raf = 0;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      const half = Math.max(8.6, 12 / aspect); // keep the whole model in frame on narrow screens
      camera.left = -half * aspect; camera.right = half * aspect;
      camera.top = half; camera.bottom = -half;
      camera.updateProjectionMatrix();
      dirty = true;
    };

    const frame = (t: number) => {
      raf = 0;
      if (!visible) return;
      if (auto) { view.thetaTo += 0.0016; }
      const settle = (cur: number, to: number, k: number) => (Math.abs(to - cur) < 1e-4 ? to : cur + (to - cur) * k);
      const before = [view.theta, view.phi, now.hour, now.declination].join();
      view.theta = settle(view.theta, view.thetaTo, 0.14);
      view.phi = settle(view.phi, view.phiTo, 0.14);
      now.hour = settle(now.hour, target.current.hour, 0.2);
      now.declination = settle(now.declination, target.current.declination, 0.1);
      const moving = before !== [view.theta, view.phi, now.hour, now.declination].join();

      if (moving || dirty) {
        const s = sunVector(now.hour, now.declination);
        sun.position.set(s.east * 50, Math.max(s.up, 0.02) * 50, -s.north * 50);
        sun.intensity = 2.4 * Math.min(1, Math.max(0, s.up) / 0.35);
        renderer.shadowMap.needsUpdate = true;
        const r = 60;
        camera.position.set(r * Math.cos(view.phi) * Math.sin(view.theta), r * Math.sin(view.phi), r * Math.cos(view.phi) * Math.cos(view.theta));
        camera.position.y += 1.6;
        camera.lookAt(0, 1.6, 0);
        renderer.render(scene, camera);
        dirty = false;
      }
      if (moving || auto) raf = requestAnimationFrame(frame);
      void t;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    wake.current = () => { dirty = true; kick(); };

    // Drag to turn. No zoom, so the wheel keeps scrolling the page.
    let drag: { x: number; y: number } | null = null;
    const stopAuto = () => { if (auto) { auto = false; } setTouched(true); };
    const onDown = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); stopAuto(); };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      view.thetaTo -= (e.clientX - drag.x) * 0.008;
      view.phiTo = Math.min(1.15, Math.max(0.42, view.phiTo + (e.clientY - drag.y) * 0.005));
      drag = { x: e.clientX, y: e.clientY };
      kick();
    };
    const onUp = () => { drag = null; };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      stopAuto();
      view.thetaTo += e.key === 'ArrowLeft' ? -0.3 : 0.3;
      kick();
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('keydown', onKey);

    const ro = new ResizeObserver(() => { resize(); kick(); });
    ro.observe(mount);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick(); });
    io.observe(mount);
    resize();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wake.current = () => {};
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => {
          (x as THREE.MeshBasicMaterial).map?.dispose();
          x.dispose();
        });
      });
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  const altitude = Math.round((Math.asin(sunVector(hour, declination).up) * 180) / Math.PI);

  return (
    <div>
      {/* Long morning and evening shadows fade out at the frame instead of being cut off */}
      <div
        ref={mountRef}
        className="relative w-full aspect-square sm:aspect-[16/10]"
        style={{ maskImage: FRAME_FADE, WebkitMaskImage: FRAME_FADE, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
      >
        {failed && (
          <p className="absolute inset-0 grid place-items-center label text-center px-6">
            The 3D model needs WebGL, which this browser has turned off.
          </p>
        )}
      </div>

      {!failed && (
        <div className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-[1fr_auto] sm:items-end border-t border-line pt-5">
          <label className="block">
            <span className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-x-4 gap-y-1">
              <span className="label">Time of day</span>
              <span className="text-[15px] tabular-nums" aria-live="off">
                {formatHour(hour)}, sun {altitude}° above the horizon
              </span>
            </span>
            <input
              type="range"
              min={7}
              max={17}
              step={0.25}
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              aria-valuetext={`${formatHour(hour)}, sun ${altitude} degrees above the horizon`}
              className="sun-range mt-3 w-full"
            />
            <span className="mt-1 flex justify-between label" aria-hidden="true">
              <span>7 am</span><span>Noon</span><span>5 pm</span>
            </span>
          </label>

          <div role="group" aria-label="Season" className="flex gap-6 text-[15px] sm:pb-6">
            {SEASONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSeason(s.id)}
                aria-pressed={season === s.id}
                className={`transition-colors ${season === s.id ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                <span className={season === s.id ? 'border-b border-ink pb-0.5' : ''}>{s.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <p className={`label mt-4 transition-opacity duration-500 ${touched ? 'opacity-0' : ''}`} aria-hidden={touched}>
        Drag the model to turn it.
      </p>
    </div>
  );
};

export default SunStudy;
