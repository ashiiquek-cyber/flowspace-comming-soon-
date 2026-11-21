import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { prefersReducedMotion } from '../context/SmoothScrollContext';

gsap.registerPlugin(ScrollTrigger, SplitText);

type Tag = 'p' | 'h1' | 'h2' | 'blockquote';

interface TextMotionProps extends React.HTMLAttributes<HTMLElement> {
  as?: Tag;
  children: React.ReactNode;
}

/**
 * Splits an element's text with SplitText and hands the pieces to `animate`.
 * autoSplit re-splits once the web fonts load or the width changes; returning
 * the animation from onSplit lets SplitText carry its progress across a re-split.
 * The text renders in its final state until this runs, and stays that way under reduced motion.
 */
const useSplit = (
  ref: React.RefObject<HTMLElement>,
  vars: { type: string; mask?: 'lines' | 'words' | 'chars'; linesClass?: string },
  animate: (split: SplitText, el: HTMLElement) => gsap.core.Animation,
) => {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      const config: SplitText.Vars = { aria: 'auto', autoSplit: true, ...vars, onSplit: (self) => animate(self, el) };
      split = SplitText.create(el, config);
    });
    return () => {
      ctx.revert();
      split?.revert();
    };
    // The text and settings are fixed for the life of the element
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/** A statement that starts pale and turns to ink word by word as it passes the reading line */
export const WordFill: React.FC<TextMotionProps> = ({ as = 'p', children, ...rest }) => {
  const ref = useRef<HTMLElement>(null);
  useSplit(ref, { type: 'words' }, (split, el) =>
    gsap.fromTo(split.words, { opacity: 0.18 }, {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true },
    }),
  );
  return React.createElement(as, { ref, ...rest }, children);
};

/** A title whose lines rise from a mask, as the hero headline does: on load, or once as it scrolls in */
export const LineRise: React.FC<TextMotionProps & { inView?: boolean }> = ({ as = 'h1', inView = false, children, ...rest }) => {
  const ref = useRef<HTMLElement>(null);
  useSplit(ref, { type: 'lines', mask: 'lines', linesClass: 'rise-line' }, (split, el) =>
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      delay: inView ? 0 : 0.12,
      scrollTrigger: inView ? { trigger: el, start: 'top 88%', once: true } : undefined,
    }),
  );
  return React.createElement(as, { ref, ...rest }, children);
};
