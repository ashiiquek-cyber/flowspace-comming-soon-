import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press';
  onNavigate: (page: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press') => void;
  variant?: 'solid' | 'transparent';
}

interface NavLinkItem {
  id: string;
  label: string;
  action?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, variant = 'solid' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = currentPage === 'home' && variant === 'transparent';
  const textColor = isHome ? 'text-white' : 'text-ink';
  const emblem = isHome ? ASSETS.emblemWhite : ASSETS.emblemDark;

  const navLinks: NavLinkItem[] = [
    { id: 'projects', label: 'Projects' },
    { id: 'studio', label: 'Studio' },
    { id: 'journal', label: 'Journal' },
    { id: 'press', label: 'Press' },
    { id: 'contact', label: 'Contact', action: () => {
      onNavigate('studio');
      setTimeout(() => {
        const el = document.getElementById('contact-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }},
  ];

  return (
    <header className={`w-full z-50 transition-colors duration-300 ${
      isHome 
        ? 'absolute top-0 left-0 bg-transparent text-white' 
        : 'sticky top-0 bg-white/95 backdrop-blur-md border-b border-line text-ink'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-5 md:py-7 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="size-9 shrink-0 relative transition-transform duration-300 group-hover:rotate-45">
            <img alt="Flowspace Emblem" className="size-full object-contain" src={emblem} />
          </div>
          <span className={`font-didact text-[15px] tracking-[4.2px] uppercase font-normal ${textColor}`}>
            FLOWSPACE
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = (currentPage === link.id) || (link.id === 'journal' && currentPage === 'article');
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.action) {
                      link.action();
                    } else if (link.id === 'projects') {
                      onNavigate('projects');
                    } else if (link.id === 'studio') {
                      onNavigate('studio');
                    } else if (link.id === 'journal') {
                      onNavigate('journal');
                    } else if (link.id === 'press') {
                      onNavigate('press');
                    }
                  }}
                  className={`text-[15px] font-medium tracking-[-0.075px] transition-colors relative py-1 cursor-pointer focus:outline-none ${
                    isActive
                      ? isHome ? 'text-white font-semibold' : 'text-ink font-semibold'
                      : isHome ? 'text-white/80 hover:text-white' : 'text-ink/75 hover:text-ink'
                  }`}
                >
                  {link.label}
                  {isActive && !isHome && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-ink" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Consultation CTA */}
          <button
            onClick={() => {
              onNavigate('studio');
              setTimeout(() => {
                const el = document.getElementById('contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`px-5 py-2.5 text-[15px] font-medium tracking-[-0.075px] transition-all duration-200 cursor-pointer ${
              isHome 
                ? 'bg-white text-ink hover:bg-white/90 shadow-sm' 
                : 'bg-ink text-white hover:bg-neutral-800'
            }`}
          >
            Book a consultation
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => {
              onNavigate('studio');
              setTimeout(() => {
                const el = document.getElementById('contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`px-3.5 py-1.5 text-[13px] font-medium tracking-tight ${
              isHome ? 'bg-white text-ink' : 'bg-ink text-white'
            }`}
          >
            Consult
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded focus:outline-none ${textColor}`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-line text-ink px-6 py-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.action) {
                    link.action();
                  } else if (link.id === 'projects') {
                    onNavigate('projects');
                  } else if (link.id === 'studio') {
                    onNavigate('studio');
                  } else if (link.id === 'journal') {
                    onNavigate('journal');
                  } else if (link.id === 'press') {
                    onNavigate('press');
                  }
                }}
                className={`text-left text-[17px] font-medium py-2 border-b border-stone-1/80 ${
                  currentPage === link.id ? 'text-ink font-semibold' : 'text-ink/80'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('studio');
                setTimeout(() => {
                  const el = document.getElementById('contact-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="mt-3 w-full py-3 bg-ink text-white text-center text-[15px] font-medium"
            >
              Book a consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
