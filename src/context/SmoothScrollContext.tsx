import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface SmoothScrollContextType {
  lenis: Lenis | null;
  isScrolled: boolean;
  /** 1 when scrolling down, -1 when scrolling up */
  direction: number;
  scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean; offset?: number; duration?: number }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [direction, setDirection] = useState(0);

  const scrollTo = useCallback((target: number | string | HTMLElement, options?: { immediate?: boolean; offset?: number; duration?: number }) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, options);
      return;
    }
    const behavior: ScrollBehavior = options?.immediate ? 'auto' : 'smooth';
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior });
    }
  }, [lenisInstance]);

  useEffect(() => {
    const onNativeScroll = () => setIsScrolled(window.scrollY > 40);

    // Reduced motion: native scrolling, ScrollTrigger still works for static layout.
    if (prefersReducedMotion()) {
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      return () => window.removeEventListener('scroll', onNativeScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    setLenisInstance(lenis);

    let lastDirection = 0;
    lenis.on('scroll', (e: Lenis) => {
      ScrollTrigger.update();
      setIsScrolled(e.scroll > 40);
      // Ignore tiny jitters so the header does not flicker
      if (Math.abs(e.velocity) > 0.5 && e.direction !== lastDirection) {
        lastDirection = e.direction;
        setDirection(e.direction);
      }
    });

    // Keyboard and jump-link scrolling bypass Lenis' wheel handling; keep the header state honest
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    // Drive Lenis from GSAP's ticker so pinned timelines and smooth scroll share one clock
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('scroll', onNativeScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, isScrolled, direction, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
};
