/**
 * Shared state between the home hero and the navbar: while the hero is pinned the
 * header must stay visible (the emblem is flying into it), until the emblem has
 * docked the bar stays see-through, and until the emblem sets off the desktop nav
 * is spread across the full width.
 */
export interface HeroState {
  /** The hero's pinned scroll range is in progress */
  active: boolean;
  /** The emblem sits in the navbar */
  docked: boolean;
  /** The emblem is on its way to (or in) the navbar, so the links gather to the right */
  gathered: boolean;
}

export const HERO_EVENT = 'flowspace:hero';

let state: HeroState = { active: false, docked: true, gathered: true };

export const getHeroState = () => state;

export const setHeroState = (next: Partial<HeroState>, animate = true) => {
  const merged = { ...state, ...next };
  if (merged.active === state.active && merged.docked === state.docked && merged.gathered === state.gathered) return;
  state = merged;
  window.dispatchEvent(new CustomEvent(HERO_EVENT, { detail: { animate } }));
};
