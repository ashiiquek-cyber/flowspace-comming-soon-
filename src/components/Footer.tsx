import React from 'react';
import { Emblem, Wordmark } from './Brand';
import { useSmoothScroll } from '../context/SmoothScrollContext';
import type { NavigateTarget } from '../data/projects';

interface FooterProps {
  onNavigate: (target: NavigateTarget) => void;
}

const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Houzz', href: 'https://houzz.in' },
];

/**
 * Sits underneath the page on large screens: the last section lifts away to
 * uncover it, like stepping out from a covered veranda.
 */
export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="lg:sticky lg:bottom-0 z-0 bg-kadappa text-lime">
      <div className="page-x pt-20 md:pt-28 pb-8 flex flex-col gap-20 md:gap-28 lg:min-h-[100svh] lg:justify-between">
        <div className="grid-page gap-y-10">
          <h2 className="col-span-12 lg:col-span-9 display text-[13vw] sm:text-[10vw] lg:text-[8.2vw]">
            Have a project in mind? Let’s create something lasting.
          </h2>
          <div className="col-span-12 lg:col-span-3 lg:self-end flex flex-col gap-4 text-[15px]">
            <a href="mailto:hello@flowspacearchitects.com" className="text-link self-start text-[17px]">
              hello@flowspacearchitects.com
            </a>
            <a
              href="https://wa.me/919447000000"
              target="_blank"
              rel="noreferrer"
              className="text-link self-start text-lime/70 hover:text-lime"
            >
              Chat on WhatsApp
            </a>
            <button onClick={() => onNavigate('contact')} className="text-link self-start text-lime/70 hover:text-lime">
              Book a consultation
            </button>
          </div>
        </div>

        <div className="grid-page gap-y-10 text-[15px] leading-relaxed border-t border-lime/15 pt-8">
          <div className="col-span-12 md:col-span-4 flex items-start gap-3">
            <Emblem className="size-9 text-lime" />
            <div>
              <Wordmark className="block" />
              <p className="text-lime/50 text-[13px] mt-1">Architects</p>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="text-lime/50 text-[13px] mb-2">Wayanad studio</p>
            <p>Kalpetta, Wayanad<br />Kerala 673122, India</p>
            <a href="tel:+919447000000" className="block mt-2 text-lime/70 hover:text-lime">+91 94470 00000</a>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="text-lime/50 text-[13px] mb-2">Bengaluru studio</p>
            <p>Jayanagar, Bengaluru<br />Karnataka 560011, India</p>
            <a href="tel:+919845000000" className="block mt-2 text-lime/70 hover:text-lime">+91 98450 00000</a>
          </div>
          <div className="col-span-12 md:col-span-2">
            <p className="text-lime/50 text-[13px] mb-2">Follow</p>
            <ul className="flex md:flex-col gap-x-6 gap-y-1">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-lime/80 hover:text-lime">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-lime/45">
          <p>© 2026 Flowspace Architects</p>
          <p>COA Reg. CA/2016/76777, IIA Fellow Member</p>
          <button onClick={() => scrollTo(0)} className="self-start sm:self-auto hover:text-lime transition-colors">
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};
