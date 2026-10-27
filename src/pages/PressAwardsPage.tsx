import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../constants/assets';
import { X, Download, ExternalLink, Check, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PressAwardsPageProps {
  onNavigate: (page: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press') => void;
}

interface AwardItem {
  id: string;
  targetYear: number;
  name: string;
  organization: string;
  recipient: string;
}

interface FeatureItem {
  id: string;
  imageCaption: string;
  meta: string;
  title: string;
  image?: string;
  details: {
    publication: string;
    date: string;
    excerpt: string;
    body: string[];
    linkText?: string;
    url?: string;
  };
}

const AWARDS_DATA: AwardItem[] = [
  {
    id: 'young-architect-2024',
    targetYear: 2024,
    name: 'Young Architect',
    organization: 'Vanitha Veedu',
    recipient: 'Ar. Rashid Ali',
  },
  {
    id: 'foaid-2023',
    targetYear: 2023,
    name: 'Design Week — featured studio',
    organization: 'FOAID',
    recipient: 'Flowspace Architects',
  },
];

const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'vanitha-veedu-feature',
    imageCaption: 'Vanitha Veedu — page or cover image',
    meta: 'Vanitha Veedu · Magazine · 2024',
    title: 'Young Architect feature',
    image: ASSETS.projectCloudHouse,
    details: {
      publication: 'Vanitha Veedu Magazine',
      date: 'Annual Architecture Issue 2024',
      excerpt: 'Awarded to Ar. Rashid Ali for excellence in environmentally responsive hillside residential architecture across Kerala.',
      body: [
        'Vanitha Veedu recognized Flowspace Architects for demonstrating how contemporary villas in Wayanad can celebrate steep tropical contours rather than flattening them.',
        'The feature highlighted the studio’s signature approach: deep monsoon overhangs, exposed local laterite masonry, and seamless integration between indoor living volumes and natural hillside topography.',
        'Chief Architect Ar. Rashid Ali was commended for championing passive climate design principles that keep living spaces naturally cool and dry throughout Kerala’s torrential monsoon seasons.',
      ],
      linkText: 'View Vanitha Veedu publication issue',
      url: 'https://www.manoramaonline.com/homestyle.html',
    },
  },
  {
    id: 'foaid-showcase',
    imageCaption: 'FOAID — page or cover image',
    meta: 'FOAID · Design festival · 2023',
    title: 'Design Week showcase',
    image: ASSETS.projectHover,
    details: {
      publication: 'Festival of Architecture & Interior Design (FOAID)',
      date: 'Design Week National Pavilion 2023',
      excerpt: 'Flowspace Architects was selected as a Featured Studio for innovative courtyard topologies and sustainable South Indian material palettes.',
      body: [
        'FOAID’s curated design pavilion brought together leading architectural practices across the subcontinent to showcase transformative residential and workspace solutions.',
        'Flowspace’s Courtyard Studio and Residence projects drew critical acclaim for their re-interpretation of the traditional Kerala nadumuttam courtyard as a modern climatic cooling engine.',
        'The jury commended the studio’s material honesty: prioritizing unpolished river stone, seasoned reclaimed timber, and locally fired clay tiles.',
      ],
      linkText: 'Visit FOAID Official Showcase',
      url: 'https://foaidindia.in',
    },
  },
  {
    id: 'houzz-profile',
    imageCaption: 'Houzz — page or cover image',
    meta: 'Houzz · Professional profile',
    title: 'Flowspace Architects on Houzz',
    image: ASSETS.projectInterior,
    details: {
      publication: 'Houzz India Editorial & Professional Showcase',
      date: 'Ongoing Directory & Best of Design',
      excerpt: 'Featured across residential editorial collections for bespoke interior joinery, tropical indoor-outdoor connectivity, and client reviews.',
      body: [
        'Flowspace Architects maintains an active, highly rated presence on Houzz, connecting with homeowners planning bespoke villas and apartment fit-outs in Wayanad and Bengaluru.',
        'The profile includes extensive photographic case studies, detailed floor plan diagrams, and verified client testimonials praising the studio’s transparent cost estimation and rigorous site supervision.',
        'Browse our full portfolio, saved ideabooks, and community discussions directly on Houzz.',
      ],
      linkText: 'Open Flowspace on Houzz',
      url: 'https://houzz.in',
    },
  },
];

export const PressAwardsPage: React.FC<PressAwardsPageProps> = ({ onNavigate }) => {
  const [activeFeature, setActiveFeature] = useState<FeatureItem | null>(null);
  const [isPressKitOpen, setIsPressKitOpen] = useState(false);
  const [pressKitDownloaded, setPressKitDownloaded] = useState(false);

  // Motion annotation 1: Title mask reveal (700ms)
  const [titleRevealed, setTitleRevealed] = useState(false);

  // Motion annotation 2: Staggered award rows + Year counting in
  const [displayYears, setDisplayYears] = useState<{ [id: string]: number }>({
    'young-architect-2024': 2000,
    'foaid-2023': 2000,
  });

  // Motion annotation 4: Button magnet (eases 4px toward cursor)
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });

  // 1. Trigger Title Mask Reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 2. Year Count-in animation on mount
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayYears({
        'young-architect-2024': Math.round(2000 + (2024 - 2000) * ease),
        'foaid-2023': Math.round(2000 + (2023 - 2000) * ease),
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  // 4. Button Magnet effect (eases up to 4px toward cursor on hover)
  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Scale down to max 4px offset as specified in Figma Dev Mode annotations
    const magnetLimit = 4;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const factor = Math.min(distance / 50, 1) * magnetLimit;

    const angle = Math.atan2(deltaY, deltaX);
    setButtonOffset({
      x: Math.cos(angle) * factor,
      y: Math.sin(angle) * factor,
    });
  };

  const handleButtonMouseLeave = () => {
    setButtonOffset({ x: 0, y: 0 });
  };

  // Mock download press kit
  const handleDownloadPressKit = () => {
    setPressKitDownloaded(true);
    // Create text file bundle representation
    const content = `FLOWSPACE ARCHITECTS — PRESS KIT 2026
--------------------------------------------------
Founder & Chief Architect: Ar. Rashid Ali
Locations:
  - Kalpetta, Wayanad (Kerala 673122)
  - Jayanagar, Bengaluru (Karnataka 560011)

Press Enquiries: hello@flowspacearchitects.com
Registration: COA Reg. CA/2016/76777

Included Assets:
1. Brand Emblem & Wordmark (Vector SVG & PNG)
2. Portrait: Ar. Rashid Ali (High-Res 300DPI)
3. Architectural Photography: The Cloud House, Terra Villa, Courtyard Studio
4. Architectural Philosophy Statement & Studio Biography

Thank you for featuring Flowspace Architects.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Flowspace-Architects-Press-Kit-2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setPressKitDownloaded(false);
      setIsPressKitOpen(false);
    }, 2500);
  };

  return (
    <div className="bg-white text-ink flex flex-col items-start w-full relative selection:bg-ink selection:text-white">
      {/* 1. HEADER SECTION (Figma: Header / node 42:1543) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="flex flex-col gap-8 md:gap-10">
          {/* Title Mask Reveal (700ms animation from Figma annotation) */}
          <div className="overflow-hidden">
            <h1
              className={`font-dm-sans font-medium text-5xl sm:text-7xl md:text-9xl lg:text-[180px] xl:text-[200px] leading-[0.86] tracking-[-4px] sm:tracking-[-8px] lg:tracking-[-12px] text-ink transition-all duration-700 ease-out ${
                titleRevealed
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0'
              }`}
            >
              Press &amp; Awards
            </h1>
          </div>

          <p className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink max-w-[620px]">
            Recognition for Flowspace Architects and Ar. Rashid Ali, and the places the studio’s work has been featured.
          </p>
        </div>
      </section>

      {/* 2. AWARDS SECTION (Figma: Awards / node 42:1546) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-36">
        {/* Awards Header */}
        <div className="border-t border-ink pt-6 pb-8 md:pb-10 flex items-end justify-between">
          <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-[56px] leading-none tracking-[-1.68px] text-ink">
            Awards
          </h2>
          <span className="font-dm-sans font-medium text-[12px] uppercase tracking-[0.48px] text-ink-muted">
            (02)
          </span>
        </div>

        {/* Awards Rows (Staggered fade up + counting year) */}
        <div className="flex flex-col border-b border-line">
          {AWARDS_DATA.map((award, index) => {
            const currentYear = displayYears[award.id] || award.targetYear;
            return (
              <div
                key={award.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className="border-t border-line py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 group hover:bg-stone-1/40 px-2 sm:px-3 -mx-2 sm:-mx-3 transition-colors duration-200 animate-in fade-in slide-in-from-bottom-2"
              >
                {/* Year (Animated Count) */}
                <span className="font-dm-sans font-normal text-[16px] leading-[1.5] text-ink-muted md:w-[120px] shrink-0 font-mono sm:font-sans">
                  {currentYear}
                </span>

                {/* Award Title */}
                <h3 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink md:w-[520px] shrink-0 group-hover:text-neutral-700 transition-colors">
                  {award.name}
                </h3>

                {/* Organization */}
                <p className="font-dm-sans font-medium text-[15px] leading-[1.2] tracking-[-0.075px] text-ink md:w-[300px] shrink-0">
                  {award.organization}
                </p>

                {/* Recipient */}
                <p className="font-dm-sans font-normal text-[16px] leading-[1.5] text-ink-muted md:w-[300px] shrink-0">
                  {award.recipient}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED IN SECTION (Figma: Featured in / node 42:1560) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-36">
        {/* Section Header */}
        <div className="border-t border-ink pt-6 mb-10 md:mb-12 flex items-end justify-between">
          <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-[56px] leading-none tracking-[-1.68px] text-ink">
            Featured in
          </h2>
          <span className="font-dm-sans font-medium text-[12px] uppercase tracking-[0.48px] text-ink-muted">
            (03)
          </span>
        </div>

        {/* 3-Column Grid with Curtain Reveal & 1.04 Zoom on Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES_DATA.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => setActiveFeature(item)}
              style={{ animationDelay: `${idx * 120}ms` }}
              className="group cursor-pointer flex flex-col gap-4 items-start animate-in fade-in slide-in-from-bottom-3 duration-500"
            >
              {/* Cover Image Container with Curtain Reveal + Zoom 1.04 */}
              <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-[#d9d9d6] flex flex-col justify-end p-4 pb-[14px] pt-[16px] px-[16px]">
                {item.image ? (
                  <>
                    <img
                      alt={item.title}
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      src={item.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <span className="relative z-10 font-dm-sans font-medium text-[12px] uppercase tracking-[0.48px] text-white">
                      {item.imageCaption}
                    </span>
                  </>
                ) : (
                  <div className="size-full flex flex-col justify-end">
                    <span className="font-dm-sans font-medium text-[12px] uppercase tracking-[0.48px] text-[#8c8c88]">
                      {item.imageCaption}
                    </span>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <span className="font-dm-sans font-medium text-[12px] uppercase tracking-[0.48px] text-ink-muted">
                {item.meta}
              </span>

              {/* Headline */}
              <h3 className="font-dm-sans font-medium text-2xl sm:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink group-hover:text-neutral-700 transition-colors">
                {item.title}
              </h3>

              {/* TextLink */}
              <div className="inline-flex items-center gap-3 border-b border-ink pb-1 pt-1 group-hover:border-neutral-500 transition-colors">
                <span className="font-dm-sans font-medium text-[15px] tracking-[-0.075px] text-ink">
                  Read feature
                </span>
                <img
                  alt=""
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  src={ASSETS.iconArrowRightDark}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. PRESS KIT BANNER (Figma: Press kit / node 42:1592) */}
      <section className="w-full bg-surface border-t border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col gap-2.5 max-w-[640px]">
            <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-[56px] leading-none tracking-[-1.68px] text-ink">
              Press kit
            </h2>
            <p className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink-muted">
              Logo, studio bio, portrait of Ar. Rashid Ali and project images (design visualisations). Press enquiries:{' '}
              <a
                href="mailto:hello@flowspacearchitects.com"
                className="underline hover:text-ink text-ink transition-colors"
              >
                hello@flowspacearchitects.com
              </a>
            </p>
          </div>

          {/* Magnetic Button (Motion annotation: on hover the button eases 4px toward the cursor) */}
          <button
            ref={buttonRef}
            onClick={() => setIsPressKitOpen(true)}
            onMouseMove={handleButtonMouseMove}
            onMouseLeave={handleButtonMouseLeave}
            style={{
              transform: `translate3d(${buttonOffset.x}px, ${buttonOffset.y}px, 0)`,
              transition: buttonOffset.x === 0 ? 'transform 0.3s ease-out' : 'transform 0.1s ease-out',
            }}
            className="inline-flex items-center gap-3.5 px-7 py-4.5 bg-ink text-white text-[15px] font-medium tracking-[-0.075px] hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
          >
            <span>Download press kit</span>
            <img alt="" className="size-4" src={ASSETS.iconArrowRightWhite} />
          </button>
        </div>
      </section>

      {/* 5. FLOATING WHATSAPP BUTTON (Figma: WhatsApp (fixed) / node 42:1647) */}
      <a
        href="https://wa.me/919447000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-6 md:right-10 z-40 bg-ink text-white flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full shadow-[0px_8px_24px_0px_rgba(0,0,0,0.22)] hover:bg-neutral-800 transition-all duration-300 hover:scale-105 group"
        aria-label="Chat on WhatsApp"
      >
        <img alt="WhatsApp" className="size-5 shrink-0" src={ASSETS.iconWhatsapp} />
        <span className="font-dm-sans font-medium text-[14px] sm:text-[15px] tracking-[-0.075px] whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>

      {/* 6. FEATURE MODAL READER */}
      {activeFeature && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl my-8 p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveFeature(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-1 text-ink transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <span className="font-dm-sans font-medium text-[12px] uppercase tracking-[0.48px] text-ink-muted">
              {activeFeature.meta}
            </span>

            <h2 className="font-dm-sans font-medium text-3xl sm:text-4xl tracking-tight text-ink mt-2 mb-3 leading-tight">
              {activeFeature.title}
            </h2>

            <p className="font-dm-sans font-normal text-sm text-ink-muted mb-6">
              {activeFeature.details.publication} · {activeFeature.details.date}
            </p>

            {activeFeature.image && (
              <div className="w-full h-64 sm:h-80 overflow-hidden mb-6 bg-stone-1">
                <img
                  alt={activeFeature.title}
                  className="size-full object-cover"
                  src={activeFeature.image}
                />
              </div>
            )}

            <div className="space-y-4 text-ink">
              <p className="font-dm-sans font-normal text-lg sm:text-xl leading-relaxed text-ink/90 border-l-2 border-ink pl-4 italic">
                {activeFeature.details.excerpt}
              </p>

              {activeFeature.details.body.map((para, i) => (
                <p key={i} className="font-dm-sans font-normal text-[16px] leading-[1.6] text-ink/80">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              {activeFeature.details.url ? (
                <a
                  href={activeFeature.details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-ink hover:underline"
                >
                  <span>{activeFeature.details.linkText || 'Visit official feature'}</span>
                  <ExternalLink size={16} />
                </a>
              ) : (
                <span className="text-sm text-ink-muted">Official press feature</span>
              )}

              <button
                onClick={() => {
                  setActiveFeature(null);
                  onNavigate('studio');
                  setTimeout(() => {
                    const el = document.getElementById('contact-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-6 py-2.5 bg-ink text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Contact studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PRESS KIT MODAL */}
      {isPressKitOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsPressKitOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-1 text-ink transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <span className="font-dm-sans font-medium text-[12px] uppercase tracking-[0.48px] text-ink-muted">
              (Media Assets)
            </span>
            <h3 className="font-dm-sans font-medium text-2xl sm:text-3xl tracking-tight text-ink mt-1 mb-2">
              Flowspace Press Kit
            </h3>
            <p className="font-dm-sans font-normal text-sm text-ink-muted mb-6">
              Curated media package for architectural journalists, design publications, and conference organizers.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-surface border border-line">
                <FileText className="size-5 text-ink shrink-0" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink">Studio Bio &amp; Founder Profile</p>
                  <p className="text-[12px] text-ink-muted">PDF &amp; Markdown (Kerala &amp; Bengaluru studios)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface border border-line">
                <ImageIcon className="size-5 text-ink shrink-0" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink">High-Resolution Visualisations</p>
                  <p className="text-[12px] text-ink-muted">The Cloud House, Terra Villa &amp; Courtyard Studio</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface border border-line">
                <Sparkles className="size-5 text-ink shrink-0" />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink">Brand Identity Pack</p>
                  <p className="text-[12px] text-ink-muted">Flowspace emblem &amp; Didact wordmark (SVG/PNG)</p>
                </div>
              </div>
            </div>

            {pressKitDownloaded ? (
              <div className="py-4 text-center text-emerald-700 flex items-center justify-center gap-2 font-medium">
                <Check size={18} />
                <span>Press kit bundle downloaded!</span>
              </div>
            ) : (
              <button
                onClick={handleDownloadPressKit}
                className="w-full py-4 bg-ink text-white font-medium text-[15px] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Download Media Package</span>
                <Download size={16} />
              </button>
            )}

            <p className="text-[12px] text-ink-muted text-center mt-3">
              Direct press enquiries: <a href="mailto:hello@flowspacearchitects.com" className="underline text-ink">hello@flowspacearchitects.com</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};