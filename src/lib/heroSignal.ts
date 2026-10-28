/**
 * Shared state between the home hero and the navbar: while the hero is pinned the
 * header must stay visible (the emblem is flying into it), and until the emblem has
 * docked the desktop nav is spread across the full width.
 */
export interface HeroState {
  /** The hero's pinned scroll range is in progress */
  active: boolean;
  /** The emblem sits in the navbar */
  docked: boolean;
}

export const HERO_EVENT = 'flowspace:hero';

let state: HeroState = { active: false, docked: true };

export const getHeroState = () => state;

export const setHeroState = (next: Partial<HeroState>, animate = true) => {
  const merged = { ...state, ...next };
  if (merged.active === state.active && merged.docked === state.docked) return;
  state = merged;
  window.dispatchEvent(new CustomEvent(HERO_EVENT, { detail: { animate } }));
};
