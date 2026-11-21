import React, { useState, useEffect, useRef } from 'react';
import { RouteLink } from '../components/RouteLink';
import { LineRise } from '../components/TextMotion';
import type { NavigateTarget } from "../data/projects";
import { ASSETS } from '../constants/assets';
import { useDialog } from '../lib/useDialog';
import { X, Download, ExternalLink, Check, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PressAwardsPageProps {
  onNavigate: (target: NavigateTarget) => void;
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
    id: 'design-vision-firm-2026',
    targetYear: 2026,
    name: 'Innovative & Most Futuristic Architecture, Landscape & Interior Design Firm of the Year 2026, South India',
    organization: 'Design & Vision Built Environment Awards, Panaji, Goa',
    recipient: 'Flowspace Architects, for residential and commercial projects',
  },
  {
    id: 'design-vision-honour-2026',
    targetYear: 2026,
    name: 'Special Honour: Trusted & Creative Architect & Designer of the Year 2026, South India',
    organization: 'Design & Vision Built Environment Awards, Panaji, Goa',
    recipient: 'Ar. Rashid Ali',
  },
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
    meta: 'Vanitha Veedu, Magazine, 2024',
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
    meta: 'FOAID, Design festival, 2023',
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
    meta: 'Houzz, Professional profile',
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

  // Motion annotation 1: the title rises from a mask (LineRise)

  // Motion annotation 2: Staggered award rows + Year counting in

  // Motion annotation 4: Button magnet (eases 4px toward cursor)
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });

  const featureCloseRef = useRef<HTMLButtonElement>(null);
  const pressKitCloseRef = useRef<HTMLButtonElement>(null);
  useDialog(!!activeFeature, () => setActiveFeature(null), featureCloseRef);
  useDialog(isPressKitOpen, () => setIsPressKitOpen(false), pressKitCloseRef);

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
Founded: 2016
Founder & Chief Architect: Ar. Rashid Ali
Locations:
  - Kalpetta, Wayanad (Kerala 673122)
  - 3rd Floor, 1 Krishna Rajendra Road, 7th Block, Jayanagar, Bengaluru 560070

Press Enquiries: flowspacearchitects@gmail.com
Phone: +91 97478 59991
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
    <div className="bg-lime text-ink w-full relative">
      {/* Header */}
      <section className="page-x pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="grid-page gap-y-8">
          <div className="col-span-12 md:col-span-8">
            <LineRise className="display text-[14vw] md:text-[9vw]">Press and awards</LineRise>
          </div>
          <p className="col-span-12 md:col-span-4 md:self-end label max-w-[34ch] leading-relaxed">
            Recognition for Flowspace Architects and Ar. Rashid Ali, and the places the studio’s work has been featured.
          </p>
        </div>
      </section>

      {/* Awards */}
      <section className="page-x pb-28 md:pb-36">
        <h2 className="label rule pt-5 mb-6 md:mb-8">Awards</h2>
        <ul className="border-b border-line">
          {AWARDS_DATA.map((award, index) => (
            <li
              key={award.id}
              style={{ animationDelay: `${index * 80}ms` }}
              className="rule py-7 grid-page gap-y-2 items-baseline group animate-in"
            >
              <span className="col-span-12 md:col-span-2 label tabular-nums">{award.targetYear}</span>
              <h3 className="col-span-12 md:col-span-5 text-[24px] sm:text-[28px] leading-[1.15] tracking-[-0.02em] group-hover:text-accent transition-colors">
                {award.name}
              </h3>
              <p className="col-span-6 md:col-span-3 text-[15px]">{award.organization}</p>
              <p className="col-span-6 md:col-span-2 text-[15px] text-ink-muted">{award.recipient}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured in */}
      <section className="page-x pb-28 md:pb-36">
        <h2 className="label rule pt-5 mb-10 md:mb-12">Featured in</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-14">
          {FEATURES_DATA.map((item, idx) => (
            <li key={item.id} style={{ animationDelay: `${idx * 120}ms` }} className="animate-in">
              <button
                onClick={() => setActiveFeature(item)}
                aria-haspopup="dialog"
                className="group w-full text-left flex flex-col gap-4 items-start"
              >
                {item.image ? (
                  <span className="block w-full aspect-[4/3] overflow-hidden bg-stone-1 mb-1">
                    <img
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      src={item.image}
                    />
                  </span>
                ) : (
                  <span aria-hidden className="block w-full rule rule-ink" />
                )}
                <span className="label">{item.meta}</span>
                <span className="text-[24px] sm:text-[28px] leading-[1.15] tracking-[-0.02em] group-hover:text-accent transition-colors">
                  {item.title}
                </span>
                <span className="text-link text-[15px]">Read feature</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Press kit */}
      <section className="bg-plaster border-t border-line">
        <div className="page-x py-14 md:py-16 grid-page gap-y-8 items-center">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="label mb-3">Press kit</h2>
            <p className="prose-serif text-[24px] sm:text-[30px] leading-[1.25] max-w-[40ch]">
              Logo, studio bio, a portrait of Ar. Rashid Ali and project visualisations.
            </p>
            <p className="label mt-3">
              Press enquiries:{' '}
              <a href="mailto:flowspacearchitects@gmail.com" className="text-link text-ink">
                flowspacearchitects@gmail.com
              </a>
            </p>
          </div>

          {/* Eases up to 4px toward the cursor on hover */}
          <div className="col-span-12 lg:col-span-4 lg:justify-self-end">
            <button
              ref={buttonRef}
              onClick={() => setIsPressKitOpen(true)}
              onMouseMove={handleButtonMouseMove}
              onMouseLeave={handleButtonMouseLeave}
              aria-haspopup="dialog"
              style={{
                transform: `translate3d(${buttonOffset.x}px, ${buttonOffset.y}px, 0)`,
                transition: buttonOffset.x === 0 ? 'transform 0.3s ease-out, background-color 0.2s' : 'transform 0.1s ease-out, background-color 0.2s',
              }}
              className="btn-solid"
            >
              Download press kit
            </button>
          </div>
        </div>
      </section>

      {/* Feature reader */}
      {activeFeature && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in"
          onClick={(e) => e.target === e.currentTarget && setActiveFeature(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feature-title"
            data-lenis-prevent
            className="bg-plaster w-full max-w-2xl p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto overscroll-contain"
          >
            <button
              ref={featureCloseRef}
              onClick={() => setActiveFeature(null)}
              className="absolute top-5 right-5 p-2 text-ink hover:text-accent transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <p className="label pr-10">{activeFeature.meta}</p>
            <h2 id="feature-title" className="text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.03em] mt-2 mb-3 pr-10">
              {activeFeature.title}
            </h2>
            <p className="label mb-6">
              {activeFeature.details.publication}, {activeFeature.details.date}
            </p>

            {activeFeature.image && (
              <div className="w-full aspect-[16/9] overflow-hidden mb-6 bg-stone-1">
                <img alt="" className="size-full object-cover" src={activeFeature.image} />
              </div>
            )}

            <div className="space-y-4">
              <p className="prose-serif text-[20px] sm:text-[22px] leading-relaxed">{activeFeature.details.excerpt}</p>
              {activeFeature.details.body.map((para) => (
                <p key={para} className="text-[16px] leading-[1.65] text-ink/80">{para}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {activeFeature.details.url ? (
                <a href={activeFeature.details.url} target="_blank" rel="noopener noreferrer" className="text-link text-[15px]">
                  {activeFeature.details.linkText || 'Visit the feature'}
                  <ExternalLink size={14} aria-hidden />
                </a>
              ) : (
                <span className="label">Printed feature</span>
              )}
              <RouteLink to="contact" onNavigate={onNavigate} className="btn-solid">
                Contact the studio
              </RouteLink>
            </div>
          </div>
        </div>
      )}

      {/* Press kit dialog */}
      {isPressKitOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in"
          onClick={(e) => e.target === e.currentTarget && setIsPressKitOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="presskit-title"
            data-lenis-prevent
            className="bg-plaster w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              ref={pressKitCloseRef}
              onClick={() => setIsPressKitOpen(false)}
              className="absolute top-5 right-5 p-2 text-ink hover:text-accent transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 id="presskit-title" className="text-[26px] sm:text-[30px] tracking-[-0.02em] mb-2 pr-10">
              Press kit
            </h2>
            <p className="label leading-relaxed mb-6">
              For journalists, publications and conference organisers.
            </p>

            <ul className="border-b border-line mb-6">
              {[
                { Icon: FileText, title: 'Studio bio and founder profile', note: 'Wayanad and Bengaluru studios' },
                { Icon: ImageIcon, title: 'High-resolution visualisations', note: 'The Cloud House, Terra Villa and Courtyard Studio' },
                { Icon: Sparkles, title: 'Brand identity', note: 'Emblem and wordmark, SVG and PNG' },
              ].map(({ Icon, title, note }) => (
                <li key={title} className="flex items-start gap-3 py-3 rule">
                  <Icon className="size-4 mt-1 text-ink-muted shrink-0" aria-hidden />
                  <div>
                    <p className="text-[15px]">{title}</p>
                    <p className="label">{note}</p>
                  </div>
                </li>
              ))}
            </ul>

            {pressKitDownloaded ? (
              <p role="status" className="py-4 text-center text-accent flex items-center justify-center gap-2">
                <Check size={18} aria-hidden />
                Press kit downloaded
              </p>
            ) : (
              <button onClick={handleDownloadPressKit} className="btn-solid w-full">
                Download press kit
                <Download size={16} aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
