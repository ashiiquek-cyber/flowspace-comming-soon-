import React, { useEffect, useRef } from 'react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

/**
 * For a modal dialog: locks page scroll while open, closes on Escape, moves focus
 * into the dialog and hands it back to whatever opened it on close.
 */
export const useDialog = (open: boolean, onClose: () => void, focusRef: React.RefObject<HTMLElement>) => {
  const { lenis } = useSmoothScroll();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    focusRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      returnTo?.focus?.();
    };
  }, [open, lenis, focusRef]);
};
