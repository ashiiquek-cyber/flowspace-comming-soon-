import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';

export type LagMode = 'expressive' | 'subtle' | 'off';

export interface LagElementRegistration {
  id: string;
  container: HTMLElement;
  target: HTMLElement;
  lagFactor: number; // e.g. 0.15 = lags behind by 15%, -0.15 = moves faster by 15%
  withInertia?: boolean; // additional dynamic inertia from scroll velocity
  direction?: 'y' | 'x';
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scroll: number;
  velocity: number;
  direction: number;
  isScrolled: boolean;
  lagMode: LagMode;
  setLagMode: (mode: LagMode) => void;
  toggleLagMode: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean; offset?: number; duration?: number }) => void;
  registerLagElement: (reg: LagElementRegistration) => void;
  unregisterLagElement: (id: string) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [scroll, setScroll] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lagMode, setLagModeState] = useState<LagMode>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'off';
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('flowspace_lag_mode') : null;
    return (saved === 'subtle' || saved === 'off' || saved === 'expressive') ? saved : 'expressive';
  });

  const elementsMapRef = useRef<Map<string, LagElementRegistration>>(new Map());
  const inertiaRef = useRef<number>(0);
  const lagModeRef = useRef<LagMode>(lagMode);
  lagModeRef.current = lagMode;

  const setLagMode = useCallback((mode: LagMode) => {
    setLagModeState(mode);
    lagModeRef.current = mode;
    try {
      localStorage.setItem('flowspace_lag_mode', mode);
    } catch {
      // ignore storage errors
    }

    if (mode === 'off') {
      // Reset all registered elements immediately
      elementsMapRef.current.forEach(({ target }) => {
        if (target) {
          target.style.transform = '';
        }
      });
    }
  }, []);

  const toggleLagMode = useCallback(() => {
    const current = lagModeRef.current;
    const next: LagMode = current === 'expressive' ? 'subtle' : current === 'subtle' ? 'off' : 'expressive';
    setLagMode(next);
  }, [setLagMode]);

  const registerLagElement = useCallback((reg: LagElementRegistration) => {
    elementsMapRef.current.set(reg.id, reg);
  }, []);

  const unregisterLagElement = useCallback((id: string) => {
    const existing = elementsMapRef.current.get(id);
    if (existing && existing.target) {
      existing.target.style.transform = '';
    }
    elementsMapRef.current.delete(id);
  }, []);

  const scrollTo = useCallback((target: number | string | HTMLElement, options?: { immediate?: boolean; offset?: number; duration?: number }) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, options);
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    }
  }, [lenisInstance]);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easeOut
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    setLenisInstance(lenis);

    let rafId: number;
    let lastScrollY = window.scrollY;
    let smoothedVelocity = 0;

    lenis.on('scroll', (e: any) => {
      const currentScroll = e.scroll;
      const currentVel = e.velocity || 0;
      smoothedVelocity = smoothedVelocity * 0.8 + currentVel * 0.2;

      setScroll(currentScroll);
      setVelocity(smoothedVelocity);
      setDirection(e.direction || (currentScroll > lastScrollY ? 1 : -1));
      setIsScrolled(currentScroll > 60);

      lastScrollY = currentScroll;
    });

    // RAF Loop for Lenis tick + Lagging Elements calculation
    const updateLoop = (time: number) => {
      lenis.raf(time);

      const mode = lagModeRef.current;
      const modeMultiplier = mode === 'expressive' ? 1.0 : mode === 'subtle' ? 0.45 : 0;

      if (modeMultiplier > 0 && elementsMapRef.current.size > 0) {
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const viewportCenterY = windowHeight / 2;

        // Smooth velocity inertia
        const targetInertia = Math.max(Math.min(smoothedVelocity * 1.5, 24), -24);
        inertiaRef.current += (targetInertia - inertiaRef.current) * 0.12;

        elementsMapRef.current.forEach((item) => {
          const { container, target, lagFactor, withInertia = false, direction: dir = 'y' } = item;
          if (!container || !target) return;

          const rect = container.getBoundingClientRect();

          // Performance check: only compute for elements in or near viewport
          if (rect.bottom < -150 || rect.top > windowHeight + 150) {
            return;
          }

          if (dir === 'y') {
            const containerCenter = rect.top + rect.height / 2;
            const centerOffset = containerCenter - viewportCenterY;

            // When element is centered, centerOffset = 0.
            // As element moves up (centerOffset < 0), a lagging element (lagFactor > 0)
            // gets positive translateY, making it move UP slower than the page!
            const parallaxOffset = -centerOffset * lagFactor * modeMultiplier;

            // Velocity drag inertia
            const inertiaOffset = withInertia ? inertiaRef.current * modeMultiplier * (lagFactor > 0 ? 1 : -1) : 0;

            const totalY = parallaxOffset + inertiaOffset;

            target.style.transform = `translate3d(0, ${totalY.toFixed(1)}px, 0)`;
          } else {
            // Horizontal lag (for horizontal ticker / floating items)
            const containerCenter = rect.left + rect.width / 2;
            const centerOffsetX = containerCenter - windowWidth / 2;
            const totalX = -centerOffsetX * lagFactor * modeMultiplier;
            target.style.transform = `translate3d(${totalX.toFixed(1)}px, 0, 0)`;
          }
        });
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisInstance,
        scroll,
        velocity,
        direction,
        isScrolled,
        lagMode,
        setLagMode,
        toggleLagMode,
        scrollTo,
        registerLagElement,
        unregisterLagElement,
      }}
    >
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
