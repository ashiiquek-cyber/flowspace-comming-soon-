// Builds the animated Flowspace emblem. Each contour line keeps the shape of
// the original logo's line: the original is sampled and fitted with a
// periodic (Fourier) curve, so the shape stays intact when it moves. The
// curve only sways sideways, so it never changes form; each line sways on its
// own period, so neighbours drift gently out of step. Boxes ride their line.
//
// Writes public/flowspace-emblem-animated.svg and src/components/emblemMotion.ts.
// Run: node scripts/emblem-motion.mjs
import { writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);

const lines = [
  { d: 'M2.236 15.019c2.422.074 4.845-1.975 6.894-1.845 2.423.149 6.15 2.292 8.758 2.143 2.609-.13 4.1-2.273 6.336-2.05 2.795.242 6.521 1.64 9.465 1.789', dur: 10 },
  { d: 'M2.05 16.211c1.677-.335 3.167 0 5.03.932 1.678.838 3.355 1.025 5.964.559 2.236-.466 4.1-1.490 6.149-1.528 2.236 0 4.1 1.528 6.522 1.435 2.236-.093 3.727-1.584 5.963-1.770l2.142-.056', dur: 13 },
  { d: 'M2.05 20.273c1.677.41 3.54.597 5.776.317 2.609-.317 4.845-2.143 7.454-2.236 2.608-.093 4.285 1.584 6.708 1.547 2.608-.038 4.472-1.547 7.08-1.603 2.236-.037 2.982.708 4.938.783', dur: 11.5 },
  { d: 'M2.702 22.77c3.26-.074 5.124-.41 6.987-1.528 1.491-.838 2.423-1.267 4.473-1.155 2.608.13 4.472 1.714 7.08 1.64 2.609-.075 4.845-2.124 7.454-2.124 2.05 0 2.981 2.012 4.956 1.826', dur: 14 },
  { d: 'M3.075 24.037c1.583-.41 4.379-.372 6.615 0 2.236.373 3.726 1.305 5.59 1.305 2.422 0 4.285-2.05 7.08-2.18 2.423-.094 4.1 1.155 5.777 1.155 2.05 0 3.54-1.957 5.404-1.994', dur: 12 },
];

const rects = [
  [8.5, 14.11, 2.68, 2.7], [23.46, 13.99, 2.8, 2.68], [3.58, 17.37, 1.98, 1.86],
  [19.75, 17.37, 1.75, 1.38], [31.84, 16.7, 1.42, 1.29], [16.88, 19.4, 1.12, 1.08],
  [31.64, 19.66, 0.88, 0.95], [3.39, 21.06, 1.17, 1.1], [12.39, 21.45, 2.93, 2.93],
  [26.27, 21.06, 2.37, 2.16],
];

const HARMONICS = 7;
const FRAMES = 60;
const f = (v) => +v.toFixed(3);

// Parse M / relative c / relative l into absolute segments.
function parse(d) {
  const segs = [];
  let x = 0, y = 0;
  for (const [, cmd, args] of d.matchAll(/([MLCcl])([^MLCcl]*)/g)) {
    const n = (args.match(/-?(?:\d+\.?\d*|\.\d+)/g) || []).map(Number);
    const rel = cmd === cmd.toLowerCase();
    const size = { m: 2, l: 2, c: 6 }[cmd.toLowerCase()];
    for (let i = 0; i < n.length; i += size) {
      const pts = [[x, y]];
      for (let j = 0; j < size; j += 2) pts.push([n[i + j] + (rel ? x : 0), n[i + j + 1] + (rel ? y : 0)]);
      if (size !== 2 || cmd !== 'M') segs.push(pts);
      [x, y] = pts[pts.length - 1];
    }
  }
  return segs;
}

// Dense (x, y) samples along the original line, sorted by x.
function sample(segs) {
  const pts = [];
  for (const p of segs) {
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      if (p.length === 2) pts.push([p[0][0] + (p[1][0] - p[0][0]) * t, p[0][1] + (p[1][1] - p[0][1]) * t]);
      else {
        const u = 1 - t, b = [u ** 3, 3 * u * u * t, 3 * u * t * t, t ** 3];
        pts.push([0, 1].map((k) => b.reduce((s, w, j) => s + w * p[j][k], 0)));
      }
    }
  }
  return pts.sort((a, b) => a[0] - b[0]);
}

const interp = (pts, x) => {
  let i = pts.findIndex((p) => p[0] >= x);
  if (i <= 0) return pts[Math.max(i, 0)][1];
  const [a, b] = [pts[i - 1], pts[i]];
  return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0] || 1);
};

// Fit y(x) on [x0, x0 + P) with a mean + HARMONICS sine/cosine terms of period P.
function fit(pts) {
  const x0 = pts[0][0], P = pts[pts.length - 1][0] - x0;
  const N = 512;
  const ys = Array.from({ length: N }, (_, i) => interp(pts, x0 + (i / N) * P));
  // Remove the end-to-end tilt so the two ends meet when the shape repeats.
  const tilt = (ys[N - 1] - ys[0]) * (N / (N - 1));
  const flat = ys.map((y, i) => y - tilt * (i / N - 0.5));
  const mean = flat.reduce((s, y) => s + y, 0) / N;
  const terms = [];
  for (let n = 1; n <= HARMONICS; n++) {
    let a = 0, b = 0;
    flat.forEach((y, i) => {
      const w = (2 * Math.PI * n * i) / N;
      a += (y - mean) * Math.cos(w);
      b += (y - mean) * Math.sin(w);
    });
    terms.push([n, (2 * a) / N, (2 * b) / N]);
  }
  const w = (x) => (2 * Math.PI * (x - x0)) / P;
  const y = (x) => mean + terms.reduce((s, [n, a, b]) => s + a * Math.cos(n * w(x)) + b * Math.sin(n * w(x)), 0);
  const dy = (x) => terms.reduce((s, [n, a, b]) => s + ((2 * Math.PI * n) / P) * (-a * Math.sin(n * w(x)) + b * Math.cos(n * w(x))), 0);
  return { x0, P, y, dy };
}

const curves = lines.map((l) => {
  const pts = sample(parse(l.d));
  return { ...fit(pts), pts, dur: l.dur };
});

// Exact cubic Hermite segments of the fitted curve, drawn a little past both
// ends so the sway never shows an end; the circle clips the overhang.
function pathFor(c) {
  const X0 = c.x0 - SWAY - 1, X1 = c.x0 + c.P + SWAY + 1, H = c.P / 32;
  let d = `M${f(X0)} ${f(c.y(X0))}`;
  for (let x = X0; x < X1 - 1e-9; x += H) {
    const x2 = x + H;
    d += `C${f(x + H / 3)} ${f(c.y(x) + (c.dy(x) * H) / 3)} ${f(x2 - H / 3)} ${f(c.y(x2) - (c.dy(x2) * H) / 3)} ${f(x2)} ${f(c.y(x2))}`;
  }
  return d;
}

// A mild sway: each line drifts SWAY units right, back through rest, SWAY left
// and home again, on its own period. Neighbours fall slightly out of step.
const SWAY = 1.4;
const shift = (i) => SWAY * Math.sin((2 * Math.PI * i) / FRAMES);

const sway = Array.from({ length: FRAMES + 1 }, (_, i) => `${f(shift(i))} 0`).join(';');
const motionLines = curves.map((c) => ({ d: pathFor(c), dur: c.dur }));

// Each box starts where it is in the logo and keeps its height above the line it sits on.
const motionRects = rects.map(([x, y, w, h]) => {
  const cx = x + w / 2, cy = y + h / 2;
  const c = curves.reduce((a, b) => (Math.abs(interp(b.pts, cx) - cy) < Math.abs(interp(a.pts, cx) - cy) ? b : a));
  const values = Array.from({ length: FRAMES + 1 }, (_, i) => f(y + c.y(cx - shift(i)) - c.y(cx))).join(';');
  return { x, y, w, h, dur: c.dur, values };
});

writeFileSync(new URL('src/components/emblemMotion.ts', root), `// Generated by scripts/emblem-motion.mjs. Do not edit by hand.
export const EMBLEM_SWAY = '${sway}';
export const EMBLEM_LINES: { d: string; dur: number }[] = ${JSON.stringify(motionLines, null, 2)};
export const EMBLEM_BOXES: { x: number; y: number; w: number; h: number; dur: number; values: string }[] = ${JSON.stringify(motionRects, null, 2)};
`);

const pathEls = motionLines.map(({ d, dur }) =>
  `      <path d="${d}">\n        <animateTransform attributeName="transform" type="translate" dur="${dur}s" repeatCount="indefinite" values="${sway}"/>\n      </path>`
).join('\n');
const rectEls = motionRects.map(({ x, y, w, h, dur, values }) =>
  `    <rect x="${x}" y="${y}" width="${w}" height="${h}">\n      <animate attributeName="y" dur="${dur}s" repeatCount="indefinite" values="${values}"/>\n    </rect>`
).join('\n');

writeFileSync(new URL('public/flowspace-emblem-animated.svg', root), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="360" height="360" fill="none" color="#111111">
  <title>Flowspace</title>
  <defs>
    <clipPath id="inside"><circle cx="17.98" cy="17.89" r="16.06"/></clipPath>
  </defs>
  <circle cx="17.98" cy="17.89" r="16.06" stroke="currentColor" stroke-width="0.9"/>
  <g clip-path="url(#inside)">
    <g stroke="currentColor" stroke-width="0.56">
${pathEls}
    </g>
  </g>
  <g fill="currentColor">
${rectEls}
  </g>
</svg>
`);
