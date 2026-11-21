import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { srcSet } from '../constants/assets';
import { prefersReducedMotion } from '../context/SmoothScrollContext';

interface ApertureProps {
  src: string;
  alt: string;
  /** Tailwind aspect / sizing classes for the frame */
  className?: string;
  imgClassName?: string;
  focus?: string;
  eager?: boolean;
  /** Rendered width hint for the srcset; defaults to full width */
  sizes?: string;
  /**
   * rise: the frame unclips from its bottom edge once, as it enters.
   * open: for full-width images; the frame starts inset from both sides and opens with the scroll, like the hero.
   */
  mode?: 'rise' | 'open';
  children?: React.ReactNode;
}

/**
 * An image that opens like a courtyard to the sky. Scroll motion scales an inner wrapper,
 * never the image, so the image's own hover zoom keeps its CSS transition.
 */
export const Aperture: React.FC<ApertureProps> = ({
  src, alt, className = '', imgClassName = '', focus, eager = false, sizes = '100vw', mode = 'rise', children,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !frameRef.current) return;
    const frame = frameRef.current;
    const ctx = gsap.context(() => {
      if (mode === 'open') {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 22%', scrub: 0.6 },
        });
        tl.fromTo(frame, { clipPath: 'inset(0% 9% 0% 9%)' }, { clipPath: 'inset(0% 0% 0% 0%)' })
          .fromTo(depthRef.current, { scale: 1.16 }, { scale: 1 }, 0);
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
        defaults: { duration: 1.25, ease: 'expo.out' },
      });
      tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' })
        .fromTo(depthRef.current, { scale: 1.12 }, { scale: 1, duration: 1.6 }, 0);
    }, frameRef);
    return () => ctx.revert();
  }, [mode]);

  return (
    <div ref={frameRef} className={`relative overflow-hidden bg-stone-1 ${className}`}>
      <div ref={depthRef} className="absolute inset-0">
        <img
          src={src}
          srcSet={srcSet(src)}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 size-full object-cover ${imgClassName}`}
          style={focus ? { objectPosition: focus } : undefined}
        />
      </div>
      {children}
    </div>
  );
};
