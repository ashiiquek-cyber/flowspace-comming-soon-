import React from 'react';
import { ASSETS } from '../constants/assets';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-ink text-white relative overflow-hidden pt-20 md:pt-28 pb-12 px-6 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section with Big Emblem and Prompt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 md:pb-24 border-b border-white/15">
          {/* Brand & Emblem */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img alt="Flowspace Emblem" className="size-8 object-contain" src={ASSETS.emblemWhite} />
                <span className="font-didact text-[15px] tracking-[4.2px] uppercase text-white font-normal">
                  FLOWSPACE
                </span>
              </div>
              <h3 className="font-dm-sans font-medium text-3xl md:text-5xl tracking-[-1.5px] leading-tight text-white mb-6">
                Have a project in mind? Let’s create something lasting.
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="mailto:hello@flowspacearchitects.com"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-ink text-[15px] font-medium hover:bg-white/90 transition-colors"
              >
                <span>hello@flowspacearchitects.com</span>
                <img alt="" className="size-4" src={ASSETS.iconArrowRightDark} />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 border border-white/20 text-white text-[15px] hover:border-white/50 transition-colors"
              >
                <img alt="" className="size-4" src={ASSETS.iconWhatsapp} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Studios Info */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Wayanad */}
            <div>
              <p className="text-[12px] uppercase tracking-[0.48px] text-white/50 font-medium mb-3">
                Wayanad Studio
              </p>
              <p className="text-[16px] text-white/90 leading-relaxed font-light">
                Kalpetta, Wayanad<br />
                Kerala 673122<br />
                India
              </p>
              <p className="mt-4 text-[14px] text-white/70">
                +91 94470 00000
              </p>
            </div>

            {/* Bengaluru */}
            <div>
              <p className="text-[12px] uppercase tracking-[0.48px] text-white/50 font-medium mb-3">
                Bengaluru Studio
              </p>
              <p className="text-[16px] text-white/90 leading-relaxed font-light">
                Jayanagar, Bengaluru<br />
                Karnataka 560011<br />
                India
              </p>
              <p className="mt-4 text-[14px] text-white/70">
                +91 98450 00000
              </p>
            </div>
          </div>

          {/* Socials & Navigation */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.48px] text-white/50 font-medium mb-3">
                Follow Flowspace
              </p>
              <div className="flex flex-col gap-2.5 text-[15px]">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors flex items-center justify-between group">
                  <span>Instagram</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors flex items-center justify-between group">
                  <span>LinkedIn</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
                <a href="https://houzz.in" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors flex items-center justify-between group">
                  <span>Houzz</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-[14px] text-white/70 hover:text-white transition-colors"
              >
                <span>Back to top</span>
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Council of Architecture Reg */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[13px] text-white/40">
          <p>© 2026 Flowspace Architects. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>COA Reg. CA/2016/76777</span>
            <span>IIA Fellow Member</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
