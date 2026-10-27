import React, { useEffect, useRef, useState } from 'react';
import { Emblem, Wordmark } from './Brand';
import { useSmoothScroll } from '../context/SmoothScrollContext';
import type { NavigateTarget, Page } from '../data/projects';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (target: NavigateTarget) => void;
}

const NAV_LINKS: { id: NavigateTarget; label: string; match: Page[] }[] = [
  { id: 'projects', label: 'Projects', match: ['projects', 'project-detail'] },
  { id: 'studio', label: 'Studio', match: ['studio'] },
  { id: 'journal', label: 'Journal', match: ['journal', 'article'] },
  { id: 'press', label: 'Press', match: ['press'] },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isScrolled, direction, lenis } = useSmoothScroll();
  const firstLinkRef = useRef<HTMLButtonElement>(null);

  const hidden = isScrolled && direction === 1 && !menuOpen;

  // Sticky sub-bars (e.g. project filters) dock under the header while it is showing
  useEffect(() => {
    document.documentElement.style.setProperty('--header-offset', hidden ? '0px' : 'var(--header-h)');
  }, [hidden]);

  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, lenis]);

  const go = (target: NavigateTarget) => {
    setMenuOpen(false);
    onNavigate(target);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out-expo ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${isScrolled && !menuOpen ? 'bg-lime border-b border-line' : 'bg-transparent border-b border-transparent'}`}
      >
        <div className="page-x h-[68px] md:h-[76px] flex items-center justify-between">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-3 text-ink"
            aria-label="Flowspace Architects, home"
          >
            <Emblem className="size-8 transition-transform duration-700 ease-out-expo hover:rotate-[30deg]" />
            <Wordmark />
          </button>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-9 text-[15px]">
            {NAV_LINKS.map((link) => {
              const active = link.match.includes(currentPage);
              return (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-1 transition-colors ${active ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px bg-current transition-[width] duration-500 ease-out-expo ${active ? 'w-full' : 'w-0'}`}
                  />
                </button>
              );
            })}
            <button onClick={() => go('contact')} className="btn-solid !py-2.5 !px-4 !text-[14px]">
              Book a consultation
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden text-[15px] text-ink py-2 pl-4"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Full-screen menu for small screens */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`lg:hidden fixed inset-0 z-40 bg-lime flex flex-col justify-between pt-[96px] pb-8 page-x transition-[opacity,visibility] duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {[{ id: 'home' as NavigateTarget, label: 'Home', match: ['home'] as Page[] }, ...NAV_LINKS, { id: 'contact' as NavigateTarget, label: 'Contact', match: [] as Page[] }].map((link, i) => (
            <button
              key={link.id}
              ref={i === 0 ? firstLinkRef : undefined}
              onClick={() => go(link.id)}
              aria-current={link.match.includes(currentPage) ? 'page' : undefined}
              className={`text-left display text-[13vw] sm:text-[64px] py-1.5 border-b border-line transition-[transform,opacity] duration-700 ease-out-expo ${
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } ${link.match.includes(currentPage) ? 'text-ink' : 'text-ink/70'}`}
              style={{ transitionDelay: menuOpen ? `${80 + i * 45}ms` : '0ms' }}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="grid grid-cols-2 gap-6 text-[14px] leading-relaxed">
          <div>
            <p className="label mb-1">Wayanad</p>
            <p>Kalpetta, Kerala 673122</p>
            <a href="tel:+919447000000" className="text-link mt-1">+91 94470 00000</a>
          </div>
          <div>
            <p className="label mb-1">Bengaluru</p>
            <p>Jayanagar, Karnataka 560011</p>
            <a href="tel:+919845000000" className="text-link mt-1">+91 98450 00000</a>
          </div>
        </div>
      </div>
    </>
  );
};
