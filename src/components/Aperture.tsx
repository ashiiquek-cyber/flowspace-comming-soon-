import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../context/SmoothScrollContext';

interface ApertureProps {
  src: string;
  alt: string;
  /** Tailwind aspect / sizing classes for the frame */
  className?: string;
  imgClassName?: string;
  focus?: string;
  eager?: boolean;
  children?: React.ReactNode;
}

/**
 * An image that opens like a courtyard to the sky: the frame unclips from its
 * bottom edge once, as it enters the viewport, while the photograph settles.
 */
export const Aperture: React.FC<ApertureProps> = ({
  src, alt, className = '', imgClassName = '', focus, eager = false, children,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !frameRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: frameRef.current, start: 'top 88%', once: true },
        defaults: { duration: 1.25, ease: 'expo.out' },
      });
      tl.fromTo(frameRef.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' })
        .fromTo(imgRef.current, { scale: 1.12 }, { scale: 1, duration: 1.6 }, 0);
    }, frameRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={frameRef} className={`relative overflow-hidden bg-stone-1 ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`absolute inset-0 size-full object-cover ${imgClassName}`}
        style={focus ? { objectPosition: focus } : undefined}
      />
      {children}
    </div>
  );
};
