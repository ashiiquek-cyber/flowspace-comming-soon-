/**
 * What the home hero's scroll timeline tells the tower model. Kept apart from HeroTower.tsx so the
 * page can create and tween it without pulling three.js into the main bundle.
 */
export interface HeroModelState {
  /** 0: the tower's boxes float apart at the edges of the screen; 1: they stand assembled */
  assemble: number;
  /** 0–1: how much of the stair has been built, from the ground up */
  stair: number;
  /** 0–1: the camera rises from just below eye level to a higher three-quarter view */
  rise: number;
}

export const createHeroModelState = (): HeroModelState => ({ assemble: 0, stair: 0, rise: 0 });
