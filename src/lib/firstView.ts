/**
 * Whether the visitor is still on the page the site opened on. The first page appears
 * as painted (holding back its title would delay the largest paint); motion that plays
 * on load is kept for pages reached by navigating.
 */
let navigated = false;

export const markNavigated = () => {
  navigated = true;
};

export const isFirstView = () => !navigated;
