import React, { useEffect, useRef, useState } from 'react';

/**
 * Small massing-model boxes, built with CSS 3D (no three.js): the emblem's boxes,
 * repeated through the page as section markers and as the Process stack.
 */

const useInView = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
};

const FACES: [string, string][] = [
  ['front', 'translateZ(var(--h))'],
  ['back', 'rotateY(180deg) translateZ(var(--h))'],
  ['right', 'rotateY(90deg) translateZ(var(--h))'],
  ['left', 'rotateY(-90deg) translateZ(var(--h))'],
  ['top', 'rotateX(90deg) translateZ(var(--h))'],
  ['bottom', 'rotateX(-90deg) translateZ(var(--h))'],
];

/** One solid box with hairline edges, like a card massing model */
export const Cube: React.FC<{ size: number; accent?: boolean }> = ({ size, accent }) => (
  <span
    className={`cube${accent ? ' cube--accent' : ''}`}
    style={{ width: size, height: size, '--h': `${size / 2}px` } as React.CSSProperties}
  >
    {FACES.map(([name, transform]) => (
      <span key={name} className={`cube__face cube__face--${name}`} style={{ transform }} />
    ))}
  </span>
);

/** The section marker: a small box that makes a quarter turn as its section arrives */
export const BoxMarker: React.FC = () => {
  const [ref, inView] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} aria-hidden="true" className="box-marker" data-in={inView || undefined}>
      <span className="box-marker__turn">
        <Cube size={11} />
      </span>
    </span>
  );
};

// Where each box sits, in box units (x right, y up, z towards the viewer): two on the ground,
// one behind, one on top. The step that adds a box shows it in moss, dropping into place
const STACK = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 0, -1],
  [1, 1, 0],
];

/** Process: one more box for each step, until the house stands */
export const BoxStack: React.FC<{ count: number; size?: number }> = ({ count, size = 16 }) => {
  const [ref, inView] = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="box-stack"
      data-in={inView || undefined}
      style={{ width: size * 4, height: size * 4, '--s': `${size}px` } as React.CSSProperties}
    >
      <span className="box-stack__model" style={{ width: size, height: size }}>
        {STACK.slice(0, count).map(([x, y, z], i) => {
          const isNew = i === count - 1;
          return (
            <span
              key={i}
              className={`box-stack__slot${isNew ? ' box-stack__slot--new' : ''}`}
              style={{ transform: `translate3d(${x * size}px, ${-y * size}px, ${z * size}px)` }}
            >
              <Cube size={size} accent={isNew} />
            </span>
          );
        })}
      </span>
    </span>
  );
};
