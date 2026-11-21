import React, { useLayoutEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../context/SmoothScrollContext';

/**
 * Draws every `.rule` hairline on the page from left to right as it arrives,
 * in a short stagger when several arrive together. Runs once per page; rules
 * that render later (an opened dialog, a new filter) simply appear drawn.
 */
export const useRuleDraw = () => {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const rules = Array.from(document.querySelectorAll<HTMLElement>('#main .rule'));
    rules.forEach((el) => el.setAttribute('data-rule', 'wait'));
    const triggers = ScrollTrigger.batch(rules, {
      start: 'top 94%',
      once: true,
      onEnter: (batch) => batch.forEach((el, i) => {
        (el as HTMLElement).style.setProperty('--rule-i', String(i));
        el.setAttribute('data-rule', 'in');
      }),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      rules.forEach((el) => {
        el.removeAttribute('data-rule');
        el.style.removeProperty('--rule-i');
      });
    };
  }, []);
};

/**
 * Mounted after the page inside its Suspense boundary (and remounted with each route),
 * so it runs only once a lazily loaded page is actually on screen.
 */
export const RuleDraw: React.FC = () => {
  useRuleDraw();
  return null;
};
