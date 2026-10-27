import React, { useState, useEffect, useRef } from 'react';
import type { NavigateTarget } from "../data/projects";
import { ASSETS } from '../constants/assets';
import { Check, Copy } from 'lucide-react';

interface ArticlePageProps {
  onNavigate: (target: NavigateTarget) => void;
  articleId?: string;
  onSelectArticle?: (id: string) => void;
}

interface TocItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'short-answer', label: 'The short answer' },
  { id: 'what-sets-cost', label: 'What sets the cost' },
  { id: 'cost-by-quality', label: 'Cost by quality level' },
  { id: 'hidden-costs', label: 'Hidden costs to plan for' },
  { id: 'keeping-budget', label: 'Keeping the budget in check' },
  { id: 'faq-section', label: 'Frequently asked questions' },
];

const ARTICLE_FAQS = [
  {
    id: 'art-faq-1',
    question: 'Is it cheaper to build on a flat plot than a slope?',
    answer: 'Usually yes. Slopes add retaining walls, deeper foundations and more site work — budget for it from the start.',
  },
  {
    id: 'art-faq-2',
    question: 'Should I fix the budget before or after the design?',
    answer: 'Before. A clear budget lets the design match it, instead of cutting things later.',
  },
  {
    id: 'art-faq-3',
    question: 'How long does a house in Wayanad take to build?',
    answer: 'It depends on size, site and weather; we give a timeline after the first site visit.',
  },
];

export const ArticlePage: React.FC<ArticlePageProps> = ({ onNavigate }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('short-answer');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('art-faq-1');
  const [copiedLink, setCopiedLink] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 1. Reading Progress Bar calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!bodyRef.current) return;
      const bodyRect = bodyRef.current.getBoundingClientRect();
      const bodyTop = bodyRect.top + window.scrollY;
      const bodyHeight = bodyRect.height;
      const currentScroll = window.scrollY;

      if (currentScroll < bodyTop) {
        setScrollProgress(0);
      } else if (currentScroll > bodyTop + bodyHeight - window.innerHeight) {
        setScrollProgress(100);
      } else {
        const progress = ((currentScroll - bodyTop) / (bodyHeight - window.innerHeight)) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // 2. Scrollspy for Sticky TOC
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const item = TOC_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-lime text-ink flex flex-col items-start w-full relative selection:bg-ink selection:text-lime">
      {/* FIXED READING PROGRESS BAR (Figma: Reading progress (fixed) / node 76:1887) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent pointer-events-none">
        <div
          className="h-full bg-ink transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 1. ARTICLE HEADER SECTION (Figma: Header / node 24:1140) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-10 md:pb-14">
        {/* Breadcrumb Link */}
        <button
          onClick={() => onNavigate('journal')}
          className="group inline-flex items-center gap-1.5 font-dm-sans font-medium text-[12px] text-ink-muted hover:text-ink transition-colors cursor-pointer mb-8"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          <span>Journal</span>
          <span className="text-line">/</span>
          <span>Costs & planning</span>
        </button>

        {/* Headline */}
        <h1 className="display text-4xl sm:text-6xl md:text-7xl lg:text-[96px] leading-[0.94] text-ink max-w-[1140px] mb-10">
          How much does it cost to build a house in Wayanad in 2026?
        </h1>

        {/* Metadata Bar */}
        <div className="border-t border-ink pt-6 flex flex-wrap items-center gap-8 sm:gap-12 lg:gap-16">
          {/* Author Chip */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full overflow-hidden bg-stone-1 border border-line shrink-0">
              <img
                alt="Ar. Rashid Ali"
                className="size-full object-cover"
                src={ASSETS.authorAvatar}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-dm-sans font-medium text-[15px] leading-tight text-ink tracking-[-0.075px]">
                Ar. Rashid Ali
              </span>
              <span className="font-dm-sans font-normal text-[14px] sm:text-[15px] text-ink-muted">
                Founder & Chief Architect
              </span>
            </div>
          </div>

          {/* Published */}
          <div className="flex flex-col gap-1">
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              Published
            </span>
            <span className="font-dm-sans font-medium text-[15px] tracking-[-0.075px] text-ink">
              12 Oct 2026
            </span>
          </div>

          {/* Updated */}
          <div className="flex flex-col gap-1">
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              Updated
            </span>
            <span className="font-dm-sans font-medium text-[15px] tracking-[-0.075px] text-ink">
              12 Oct 2026
            </span>
          </div>

          {/* Reading Time */}
          <div className="flex flex-col gap-1">
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              Reading time
            </span>
            <span className="font-dm-sans font-medium text-[15px] tracking-[-0.075px] text-ink">
              8 min
            </span>
          </div>
        </div>
      </section>

      {/* 2. HERO IMAGE (Figma: Image / node 24:1158) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <div className="relative w-full h-[360px] sm:h-[500px] lg:h-[720px] overflow-hidden bg-stone-1 flex flex-col justify-end p-4 sm:p-5">
          <img
            alt="Wayanad Architecture Design Visualisation"
            className="absolute inset-0 size-full object-cover"
            src={ASSETS.projectCloudHouse}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
          <span className="relative z-10 font-dm-sans font-medium text-[12px] text-lime">
            Design visualisation
          </span>
        </div>
      </section>

      {/* 3. BODY SECTION (Figma: Body / node 24:1160) */}
      <section
        ref={bodyRef}
        className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-36"
      >
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
          {/* STICKY SIDEBAR (TOC + Share) (Figma: Sidebar / node 24:1161) */}
          <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-28 space-y-8">
            <div className="flex flex-col gap-3.5">
              <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
                On this page
              </span>
              <nav className="flex flex-col" aria-label="Table of contents">
                {TOC_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left py-1.5 pl-3.5 text-[15px] sm:text-[16px] leading-[1.5] transition-all duration-200 cursor-pointer focus:outline-none ${
                        isActive
                          ? 'border-l-2 border-ink text-ink font-medium'
                          : 'border-l border-line text-ink-muted hover:text-ink hover:border-ink/40'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Share Widget */}
            <div className="pt-6 border-t border-line flex flex-col gap-2.5">
              <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
                Share
              </span>
              <div className="flex items-center gap-3 text-[15px] sm:text-[16px] text-ink font-normal">
                <button
                  onClick={handleCopyLink}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-ink-muted" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
                <span className="text-line">·</span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    'How much does it cost to build a house in Wayanad in 2026? by Flowspace Architects ' + window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  WhatsApp
                </a>
                <span className="text-line">·</span>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </aside>

          {/* MAIN ARTICLE CONTENT (Figma: Content / node 24:1178) */}
          <article className="w-full lg:w-[760px] flex flex-col gap-12 sm:gap-14">
            {/* 1. Short Answer Box (AEO Snippet) */}
            <div
              id="short-answer"
              className="bg-surface border-l-[3px] border-ink p-6 sm:p-8 flex flex-col gap-3.5"
            >
              <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
                The short answer
              </span>
              <p className="font-dm-sans font-normal text-xl sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink">
                Most new homes in Wayanad fall within ₹2,800 – 4,800 per sq ft in 2026, depending on finish level, site slope and access. Fix your budget first, then let the design follow it.
              </p>
            </div>

            {/* 2. What Sets the Cost */}
            <div id="what-sets-cost" className="flex flex-col gap-5 text-ink">
              <h2 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px]">
                What sets the cost
              </h2>
              <p className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px]">
                Three things move the number most: the size of the house, the quality of finishes, and the site itself. A sloping or hard-to-reach plot can add more than a bigger kitchen ever will.
              </p>
              <p className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px]">
                Design decisions matter too. A compact plan with fewer corners and a simple roof costs less to build and to maintain.
              </p>
            </div>

            {/* 3. Cost by Quality Level (Table) */}
            <div id="cost-by-quality" className="flex flex-col gap-5">
              <h2 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink">
                Cost by quality level
              </h2>

              <div className="w-full overflow-x-auto no-scrollbar">
                <div className="min-w-[640px] flex flex-col">
                  {/* Table Header */}
                  <div className="border-b border-ink py-3.5 flex font-dm-sans font-medium text-[12px] text-ink-muted">
                    <span className="w-[160px] shrink-0">Level</span>
                    <span className="w-[220px] shrink-0">Typical range</span>
                    <span className="flex-1">Includes</span>
                  </div>

                  {/* Table Rows */}
                  {[
                    {
                      level: 'Basic',
                      range: '₹2,600 – 3,100 / sq ft',
                      includes: 'Simple plan, standard tiles and fittings, minimal joinery',
                    },
                    {
                      level: 'Standard',
                      range: '₹3,400 – 4,200 / sq ft',
                      includes: 'Better finishes, more glazing, built-in wardrobes and kitchen',
                    },
                    {
                      level: 'Premium',
                      range: '₹4,500 + / sq ft',
                      includes: 'Custom details, natural stone and timber, landscaping',
                    },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="border-b border-line py-4.5 flex items-baseline"
                    >
                      <span className="w-[160px] shrink-0 font-dm-sans font-medium text-[15px] tracking-[-0.075px] text-ink">
                        {row.level}
                      </span>
                      <span className="w-[220px] shrink-0 font-dm-sans font-medium text-[15px] tracking-[-0.075px] text-ink">
                        {row.range}
                      </span>
                      <span className="flex-1 font-dm-sans font-normal text-[15px] sm:text-[16px] leading-[1.5] text-ink-muted">
                        {row.includes}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="font-dm-sans font-normal text-[15px] text-ink-muted">
                Ranges are updated for 2026 based on ongoing studio projects across Wayanad district.
              </p>
            </div>

            {/* 4. Figure / In-article Image */}
            <div className="flex flex-col gap-3">
              <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[460px] overflow-hidden bg-[#d9d9d6] flex flex-col justify-end p-4 pb-[14px] pt-[16px] px-[16px]">
                <span className="font-dm-sans font-medium text-[12px] text-[#8c8c88]">
                  Site photo
                </span>
              </div>
              <p className="font-dm-sans font-normal text-[15px] sm:text-[16px] leading-[1.5] text-ink-muted">
                A sloping plot near Kalpetta — site work is part of the budget.
              </p>
            </div>

            {/* 5. Hidden Costs to Plan For */}
            <div id="hidden-costs" className="flex flex-col gap-5">
              <h2 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink">
                Hidden costs to plan for
              </h2>

              <div className="flex flex-col">
                {[
                  'Site clearing and retaining walls on sloping plots',
                  'Permit and approval fees',
                  'Water, septic and power connections',
                  'Compound wall, gate and landscaping',
                  'Architect and structural engineer fees',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="border-b border-line py-3.5 flex items-start gap-4 font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink"
                  >
                    <span className="text-ink-muted select-none">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Studio Tip Box */}
            <div className="bg-ink text-lime p-6 sm:p-8 flex flex-col gap-3">
              <span className="font-dm-sans font-medium text-[12px] text-[#d9d9d6]">
                Studio tip
              </span>
              <p className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-lime">
                Spend first on what is hard to change later — the structure, the roof and the openings. Finishes can be upgraded over time.
              </p>
            </div>

            {/* 7. Keeping the Budget in Check */}
            <div id="keeping-budget" className="flex flex-col gap-5 text-ink">
              <h2 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px]">
                Keeping the budget in check
              </h2>
              <p className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px]">
                Agree the scope early, keep the plan compact, and choose materials that are available locally. Every change made on site costs more than the same change made on paper.
              </p>
            </div>

            {/* 8. Frequently Asked Questions */}
            <div id="faq-section" className="flex flex-col gap-4">
              <h2 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink">
                Frequently asked questions
              </h2>

              <div className="flex flex-col">
                {ARTICLE_FAQS.map((faq) => {
                  const isOpen = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className="border-t border-line py-5">
                      <button
                        onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                        className="w-full flex items-start justify-between text-left gap-4 cursor-pointer focus:outline-none group"
                        aria-expanded={isOpen}
                      >
                        <span className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink group-hover:text-accent transition-colors">
                          {faq.question}
                        </span>
                        <span className="shrink-0 size-6 flex items-center justify-center pt-1 text-ink">
                          {isOpen ? (
                            <img alt="" className="size-5" src={ASSETS.iconMinus} />
                          ) : (
                            <img alt="" className="size-5" src={ASSETS.iconPlus} />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pt-3 pr-6 animate-in fade-in duration-200">
                          <p className="font-dm-sans font-normal text-[16px] leading-[1.5] text-ink-muted">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 9. Author Box */}
            <div className="border-y border-ink py-8 flex flex-col sm:flex-row items-start gap-6">
              <div className="size-16 sm:size-[72px] rounded-full overflow-hidden bg-stone-1 border border-line shrink-0">
                <img
                  alt="Ar. Rashid Ali"
                  className="size-full object-cover"
                  src={ASSETS.authorAvatarLg}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
                  Written by
                </span>
                <h3 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink">
                  Ar. Rashid Ali
                </h3>
                <p className="font-dm-sans font-normal text-[15px] sm:text-[16px] leading-[1.5] text-ink-muted">
                  Founder and Chief Architect at Flowspace Architects, with studios in Wayanad and Bengaluru.
                </p>
                <button
                  onClick={() => onNavigate('studio')}
                  className="self-start inline-flex items-center gap-2 border-b border-ink pb-1 pt-1 text-[15px] font-medium text-ink hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  <span>About the studio</span>
                  <img alt="" className="size-3.5" src={ASSETS.iconArrowRightDark} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 4. MORE FROM THE JOURNAL (Figma: Related / node 24:1262) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-36">
        <div className="border-t border-ink pt-5 flex items-start justify-between mb-12 md:mb-14">
          <h2 className="font-dm-sans font-medium text-3xl sm:text-4xl md:text-[56px] leading-none tracking-[-1.68px] text-ink">
            More from the Journal
          </h2>
          <button
            onClick={() => onNavigate('journal')}
            className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-[15px] font-medium text-ink hover:text-neutral-600 transition-colors cursor-pointer"
          >
            <span>All articles</span>
            <img
              alt=""
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
              src={ASSETS.iconArrowRightDark}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-14">
          {/* Related Card 1 */}
          <article
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer flex flex-col gap-4 items-start"
          >
            <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[293px] overflow-hidden bg-[#d9d9d6] flex flex-col justify-end p-4 pb-[14px] pt-[16px] px-[16px]">
              <span className="font-dm-sans font-medium text-[12px] text-[#8c8c88]">
                Cover image
              </span>
            </div>
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              Permits — Aug 2026
            </span>
            <h3 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink group-hover:text-accent transition-colors">
              Building permits in Kerala, step by step
            </h3>
            <p className="font-dm-sans font-normal text-[15px] sm:text-[16px] leading-[1.5] text-ink-muted">
              What to file, who approves it, and how long each stage usually takes.
            </p>
            <span className="font-dm-sans font-medium text-[14px] sm:text-[15px] tracking-[-0.075px] text-ink pt-1">
              7 min read
            </span>
          </article>

          {/* Related Card 2 */}
          <article
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer flex flex-col gap-4 items-start"
          >
            <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[293px] overflow-hidden bg-[#d9d9d6] flex flex-col justify-end p-4 pb-[14px] pt-[16px] px-[16px]">
              <span className="font-dm-sans font-medium text-[12px] text-[#8c8c88]">
                Cover image
              </span>
            </div>
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              Costs & planning — Jul 2026
            </span>
            <h3 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink group-hover:text-accent transition-colors">
              Building on a hill slope in Wayanad
            </h3>
            <p className="font-dm-sans font-normal text-[15px] sm:text-[16px] leading-[1.5] text-ink-muted">
              Site surveys, retaining walls and the rules that apply to sloping plots.
            </p>
            <span className="font-dm-sans font-medium text-[14px] sm:text-[15px] tracking-[-0.075px] text-ink pt-1">
              9 min read
            </span>
          </article>

          {/* Related Card 3 */}
          <article
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer flex flex-col gap-4 items-start"
          >
            <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[293px] overflow-hidden bg-stone-1 flex flex-col justify-end p-4 pb-[14px] pt-[16px] px-[16px]">
              <img
                alt="Designing a Kerala home for the monsoon"
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={ASSETS.projectHover}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              <span className="relative z-10 font-dm-sans font-medium text-[12px] text-lime">
                Design visualisation
              </span>
            </div>
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              Climate & materials — Sep 2026
            </span>
            <h3 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink group-hover:text-accent transition-colors">
              Designing a Kerala home for the monsoon
            </h3>
            <p className="font-dm-sans font-normal text-[15px] sm:text-[16px] leading-[1.5] text-ink-muted">
              Roof pitch, deep overhangs and cross-ventilation — the decisions that keep a house dry and cool.
            </p>
            <span className="font-dm-sans font-medium text-[14px] sm:text-[15px] tracking-[-0.075px] text-ink pt-1">
              6 min read
            </span>
          </article>
        </div>
      </section>

      {/* 5. "PLANNING A HOME IN WAYANAD?" CTA STRIP (Figma: CTA / node 24:1291) */}
      <section className="w-full bg-surface border-t border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-18 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <h2 className="font-dm-sans font-medium text-3xl sm:text-5xl md:text-[56px] leading-tight tracking-[-1.68px] text-ink">
            Planning a home in Wayanad?
          </h2>
          <button
            onClick={() => {
              onNavigate('contact');
            }}
            className="inline-flex items-center gap-3.5 px-7 py-4.5 bg-ink text-lime text-[15px] font-medium tracking-[-0.075px] hover:bg-accent transition-colors cursor-pointer shrink-0"
          >
            <span>Book a consultation</span>
            <img alt="" className="size-4" src={ASSETS.iconArrowRightWhite} />
          </button>
        </div>
      </section>

      {/* 6. FLOATING WHATSAPP BUTTON (Figma: WhatsApp (fixed) / node 41:1601) */}
      <a
        href="https://wa.me/919447000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-6 md:right-10 z-40 bg-ink text-lime flex items-center gap-2.5 pl-4 pr-5 py-3 hover:bg-accent transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <img alt="WhatsApp" className="size-5 shrink-0" src={ASSETS.iconWhatsapp} />
        <span className="font-dm-sans font-medium text-[14px] sm:text-[15px] tracking-[-0.075px] whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};