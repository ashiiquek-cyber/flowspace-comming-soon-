import React from 'react';
import { PROJECTS_DATA, type NavigateTarget } from '../data/projects';

/** The address for a page, so navigation can be a real link (new tab, copy link, middle-click). */
export const hrefFor = (target: NavigateTarget) =>
  target === 'home' ? '#/' : target === 'project-detail' ? `#/project/${PROJECTS_DATA[0].id}` : `#/${target}`;

type RouteLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: NavigateTarget;
  onNavigate: (target: NavigateTarget) => void;
};

/**
 * A plain anchor with a real href. A plain left click still goes through the app's
 * navigate(), which also handles re-clicking the page you are on; modified clicks
 * (new tab, new window) fall through to the browser.
 */
export const RouteLink = React.forwardRef<HTMLAnchorElement, RouteLinkProps>(({ to, onNavigate, onClick, ...rest }, ref) => (
  <a
    ref={ref}
    href={hrefFor(to)}
    onClick={(e) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      onNavigate(to);
    }}
    {...rest}
  />
));
RouteLink.displayName = 'RouteLink';
