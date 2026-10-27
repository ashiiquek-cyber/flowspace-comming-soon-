import React, { useState, useEffect } from 'react';
import { ASSETS } from '../constants/assets';
import { LagItem } from '../components/ParallaxLag';

interface LandingPageProps {
  onNavigate: (page: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Testimonials carousel state
  const testimonials = [
    {
      quote: "A space that feels completely natural to the Wayanad hillside. Rashid and his team understood the light and monsoon winds like no one else.",
      author: "K. N. Chandran",
      role: "Homeowner, Kalpetta"
    },
    {
      quote: "Flowspace transformed our tight urban plot in Bengaluru into a tranquil sanctuary filled with courtyards and skylights. Exceptional detailing.",
      author: "Pooja & Sameer Reddy",
      role: "Residents, Jayanagar"
    },
    {
      quote: "Their commitment to honest materials, local laterite, and climate responsiveness sets them apart. They delivered beyond our expectations.",
      author: "Mathews Varghese",
      role: "Estate Owner, Vythiri"
    },
    {
      quote: "Working with Rashid was a collaborative joy. The house breathes and stays cool even in peak summer without active cooling.",
      author: "Ananya Swaminathan",
      role: "Homeowner, Bengaluru"
    }
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Philosophy scroll highlight progress
  const [scrollProgress, setScrollProgress] = useState(0.4);

  useEffect(() => {
    const handleScroll = () => {
      const philosophyEl = document.getElementById('philosophy-section');
      if (philosophyEl) {
        const rect = philosophyEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // calculate progress as element passes through viewport
        const progress = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      q: "How long does it take to design and build a house?",
      a: "Typically 12 to 18 months depending on scale. Concept and approvals take 3–4 months, with 9–14 months of supervised construction."
    },
    {
      q: "What are your architectural design fees?",
      a: "Our fee structure is transparent, calculated either as a percentage of construction cost (typically 7–10%) or a fixed square-foot rate based on project complexity."
    },
    {
      q: "Do you handle construction supervision?",
      a: "Yes, we offer comprehensive site supervision and periodic inspection to ensure that materials, tolerances, and design intent are executed faithfully."
    },
    {
      q: "Can you work on projects outside Wayanad and Bengaluru?",
      a: "Yes, we undertake select residential and hospitality projects across Kerala, Karnataka, and Tamil Nadu when the site and vision align."
    }
  ];

  return (
    <div className="bg-white text-ink flex flex-col items-start w-full relative">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen h-[100dvh] max-h-screen flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 md:pb-10 px-6 md:px-10 overflow-hidden box-border">
        {/* Background image with gentle depth lag & dual gradient overlays */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <LagItem
            lag={-0.12}
            wrapperClassName="absolute -top-[10%] -bottom-[10%] inset-x-0 w-full h-[120%]"
            className="size-full"
          >
            <img
              alt="Flowspace Hero Architecture"
              className="size-full object-cover object-center scale-105"
              src={ASSETS.heroBg}
            />
          </LagItem>
          <div
            className="absolute inset-0 z-1"
            style={{
              backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.68) 100%), linear-gradient(90deg, rgba(10, 10, 10, 0.42) 0%, rgba(10, 10, 10, 0.42) 100%)"
            }}
          />
        </div>

        {/* Top Eyebrows */}
        <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] sm:text-[12px] font-medium tracking-[0.48px] uppercase text-white/90 gap-1 sm:gap-2">
          <p className="opacity-85">Architecture · Interiors · Sustainable design</p>
          <p className="opacity-85">Wayanad — Bengaluru</p>
        </div>

        {/* Hero Title with Subtle Floating Lag */}
        <div className="relative z-10 my-auto py-2 sm:py-4 flex items-center">
          <LagItem lag={0.06} inertia className="max-w-[1360px]">
            <h1 className="font-dm-sans font-medium text-[clamp(2.75rem,7.5vw,9.5rem)] leading-[0.88] tracking-[-2px] sm:tracking-[-5px] md:tracking-[-7px] lg:tracking-[-9px] text-accent">
              Spaces that speak for themselves.
            </h1>
          </LagItem>
        </div>

        {/* Hero Intro & CTA (Standard scroll - "goes") */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 pt-4 sm:pt-6 border-t border-white/20">
          <p className="font-normal text-sm sm:text-base md:text-lg lg:text-[20px] leading-[1.35] text-white tracking-[-0.2px] max-w-[580px]">
            Flowspace Architects is an architecture and design studio led by Chief Architect Ar. Rashid Ali — designing homes, workplaces and interiors from Wayanad and Bengaluru.
          </p>

          <button
            onClick={() => onNavigate('projects')}
            className="group shrink-0 inline-flex items-center gap-3 border-b border-white pb-1.5 text-[14px] sm:text-[15px] font-medium text-white tracking-[-0.075px] hover:text-white/80 transition-colors cursor-pointer"
          >
            <span>View all projects</span>
            <img alt="" className="size-4 transition-transform duration-200 group-hover:translate-x-1" src={ASSETS.iconArrowRightWhite} />
          </button>
        </div>
      </section>

      {/* 2. PHILOSOPHY SECTION */}
      <section id="philosophy-section" className="relative w-full max-w-[1440px] mx-auto px-6 md:px-10 py-24 md:py-40 overflow-hidden">
        {/* Background typographic watermark that lags with deep architectural inertia */}
        <LagItem
          lag={0.24}
          wrapperClassName="absolute -top-10 right-4 md:right-16 pointer-events-none select-none z-0 opacity-[0.04]"
        >
          <span className="font-dm-sans font-bold text-[120px] sm:text-[180px] md:text-[260px] tracking-tighter text-ink leading-none">
            SPACE
          </span>
        </LagItem>

        <div className="relative z-10 flex flex-col gap-10 md:gap-14">
          <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
            (Our philosophy)
          </p>

          <div className="font-dm-sans font-medium text-3xl sm:text-5xl md:text-7xl lg:text-[84px] xl:text-[96px] leading-[1.04] tracking-[-2px] md:tracking-[-3.84px] max-w-[1280px]">
            <span
              className="transition-colors duration-300"
              style={{
                color: scrollProgress > 0.3 ? '#0b0b0b' : '#bdbdb9'
              }}
            >
              A space should speak for itself — without any description.{" "}
            </span>
            <span
              className="transition-colors duration-300"
              style={{
                color: scrollProgress > 0.6 ? '#0b0b0b' : '#bdbdb9'
              }}
            >
              We let form follow function, and function follow the people who live in it.
            </span>
          </div>

          <button
            onClick={() => onNavigate('studio')}
            className="group self-start inline-flex items-center gap-3 border-b border-ink pb-1.5 text-[15px] font-medium text-ink hover:text-accent transition-colors"
          >
            <span>About the studio</span>
            <img alt="" className="size-4 transition-transform duration-200 group-hover:translate-x-1" src={ASSETS.iconArrowRightDark} />
          </button>
        </div>
      </section>

      {/* 3. STATS SECTION (Differential scroll: alternating stats lag behind while companion stats go at standard speed) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 items-start">
          {/* Stat 1: Standard speed ("goes") */}
          <LagItem lag={0} wrapperClassName="h-full" className="border-t border-ink pt-6 flex flex-col gap-3">
            <span className="font-dm-sans font-medium text-6xl md:text-8xl tracking-[-3.84px] text-ink">
              02
            </span>
            <p className="text-[12px] uppercase tracking-[0.48px] font-medium text-ink">
              Studios
            </p>
            <p className="text-[16px] leading-relaxed text-ink-muted">
              Kalpetta, Wayanad and Jayanagar, Bengaluru.
            </p>
          </LagItem>

          {/* Stat 2: Lags behind ("section lag") */}
          <LagItem lag={0.14} inertia wrapperClassName="h-full" className="border-t border-ink pt-6 flex flex-col gap-3">
            <span className="font-dm-sans font-medium text-6xl md:text-8xl tracking-[-3.84px] text-ink">
              20+
            </span>
            <p className="text-[12px] uppercase tracking-[0.48px] font-medium text-ink">
              Design services
            </p>
            <p className="text-[16px] leading-relaxed text-ink-muted">
              From house plans to conservation and urban work.
            </p>
          </LagItem>

          {/* Stat 3: Standard speed ("goes") */}
          <LagItem lag={0} wrapperClassName="h-full" className="border-t border-ink pt-6 flex flex-col gap-3">
            <span className="font-dm-sans font-medium text-6xl md:text-8xl tracking-[-3.84px] text-ink">
              06
            </span>
            <p className="text-[12px] uppercase tracking-[0.48px] font-medium text-ink">
              Project categories
            </p>
            <p className="text-[16px] leading-relaxed text-ink-muted">
              Homes, apartments, commercial, retail, interiors, furniture.
            </p>
          </LagItem>

          {/* Stat 4: Lags behind with extra inertia ("section lag") */}
          <LagItem
            lag={0.18}
            inertia
            wrapperClassName="h-full"
            className="border-t border-ink pt-6 flex flex-col gap-3 cursor-pointer group hover:opacity-85 transition-opacity"
            onClick={() => onNavigate('press')}
          >
            <span className="font-dm-sans font-medium text-6xl md:text-8xl tracking-[-3.84px] text-ink">
              02
            </span>
            <p className="text-[12px] uppercase tracking-[0.48px] font-medium text-ink flex items-center justify-between">
              <span>Honours</span>
              <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
            </p>
            <p className="text-[16px] leading-relaxed text-ink-muted">
              Vanitha Veedu Young Architect, FOAID Design Week.
            </p>
          </LagItem>
        </div>
      </section>

      {/* 4. SELECTED WORK (STICKY STACKING CARDS) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        {/* Section Header */}
        <div className="border-t border-ink pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-3">
              (Selected work)
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-6xl tracking-[-1.68px] text-ink">
                Projects
              </h2>
              <span className="text-[13px] uppercase tracking-[0.48px] text-ink-muted font-medium">
                (03)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-lg md:text-[22px] leading-[1.4] text-ink-muted tracking-[-0.22px] max-w-[440px]">
              Homes, interiors and spaces from our studios in Wayanad and Bengaluru.
            </p>
            <button
              onClick={() => onNavigate('projects')}
              className="group self-start inline-flex items-center gap-3 border-b border-ink pb-1.5 text-[15px] font-medium text-ink hover:text-accent transition-colors"
            >
              <span>All projects</span>
              <img alt="" className="size-4 transition-transform duration-200 group-hover:translate-x-1" src={ASSETS.iconArrowRightDark} />
            </button>
          </div>
        </div>

        {/* Stack of Cards */}
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('project-detail')}
            className="sticky top-24 md:top-28 w-full h-[540px] md:h-[680px] rounded-lg overflow-hidden p-8 md:p-12 flex flex-col justify-between text-white cursor-pointer group shadow-2xl transition-transform duration-500"
            style={{
              backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 0.8) 100%)",
            }}
          >
            <div className="absolute inset-0 size-full overflow-hidden -z-10">
              <LagItem lag={-0.08} wrapperClassName="absolute -top-[10%] -bottom-[10%] inset-x-0 w-full h-[120%]" className="size-full">
                <img
                  alt="The Cloud House"
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={ASSETS.projectCloudHouse}
                />
              </LagItem>
            </div>

            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] uppercase tracking-[0.48px] font-medium text-white/90">
                (01)
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-white/60 text-[14px] text-white backdrop-blur-sm group-hover:bg-white group-hover:text-ink transition-colors">
                View project ↗
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.48px] font-medium text-white/70 mb-2">
                  Completed 2024 · Kalpetta, Wayanad
                </p>
                <h3 className="font-dm-sans font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-3px] text-white">
                  The Cloud House
                </h3>
              </div>
              <p className="text-[15px] md:text-[16px] text-white/80 max-w-[420px] leading-relaxed">
                A family residence crafted into the contour of the Western Ghats, utilizing local laterite and open breezy verandas.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('project-detail')}
            className="sticky top-28 md:top-36 w-full h-[540px] md:h-[680px] rounded-lg overflow-hidden p-8 md:p-12 flex flex-col justify-between text-white cursor-pointer group shadow-2xl transition-transform duration-500"
            style={{
              backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 0.8) 100%)",
            }}
          >
            <div className="absolute inset-0 size-full overflow-hidden -z-10">
              <LagItem lag={-0.08} wrapperClassName="absolute -top-[10%] -bottom-[10%] inset-x-0 w-full h-[120%]" className="size-full">
                <img
                  alt="Terra Villa"
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={ASSETS.projectTerraVilla}
                />
              </LagItem>
            </div>

            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] uppercase tracking-[0.48px] font-medium text-white/90">
                (02)
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-white/60 text-[14px] text-white backdrop-blur-sm group-hover:bg-white group-hover:text-ink transition-colors">
                View project ↗
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.48px] font-medium text-white/70 mb-2">
                  Completed 2025 · Jayanagar, Bengaluru
                </p>
                <h3 className="font-dm-sans font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-3px] text-white">
                  Terra Villa
                </h3>
              </div>
              <p className="text-[15px] md:text-[16px] text-white/80 max-w-[420px] leading-relaxed">
                An urban biophilic courtyard home balancing high-density living with private internal botanical gardens.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('project-detail')}
            className="sticky top-32 md:top-44 w-full h-[540px] md:h-[680px] rounded-lg overflow-hidden p-8 md:p-12 flex flex-col justify-between text-white cursor-pointer group shadow-2xl transition-transform duration-500"
            style={{
              backgroundImage: "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 0.8) 100%)",
            }}
          >
            <div className="absolute inset-0 size-full overflow-hidden -z-10">
              <LagItem lag={-0.08} wrapperClassName="absolute -top-[10%] -bottom-[10%] inset-x-0 w-full h-[120%]" className="size-full">
                <img
                  alt="The Courtyard Studio"
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={ASSETS.projectHover}
                />
              </LagItem>
            </div>

            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] uppercase tracking-[0.48px] font-medium text-white/90">
                (03)
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-white/60 text-[14px] text-white backdrop-blur-sm group-hover:bg-white group-hover:text-ink transition-colors">
                View project ↗
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.48px] font-medium text-white/70 mb-2">
                  Completed 2026 · Wayanad
                </p>
                <h3 className="font-dm-sans font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-3px] text-white">
                  The Courtyard Studio
                </h3>
              </div>
              <p className="text-[15px] md:text-[16px] text-white/80 max-w-[420px] leading-relaxed">
                Adaptive reuse workspace blending industrial timber trusses with earthy rammed earth walls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="border-t border-ink pt-6 mb-12 flex items-baseline justify-between">
          <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-6xl tracking-[-1.68px] text-ink">
            Our Process
          </h2>
          <span className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
            (From idea to built form)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {[
            {
              step: "(01)",
              title: "Site visit & brief",
              body: "We walk the plot with you, listen to how your family lives, and agree a budget before a single line is drawn.",
              duration: "Week 1–2",
              lag: 0
            },
            {
              step: "(02)",
              title: "Concept & Form",
              body: "Climate orientation, spatial flow diagrams, and 3D architectural massing presented with tangible material samples.",
              duration: "Week 3–6",
              lag: 0.14
            },
            {
              step: "(03)",
              title: "Detailing & Approvals",
              body: "Complete structural, electrical, and plumbing documentation alongside municipality clearances in Kerala & Karnataka.",
              duration: "Month 2–3",
              lag: 0
            },
            {
              step: "(04)",
              title: "Realization",
              body: "Strict periodic on-site supervision, artisan collaboration, and handover with full post-occupancy care.",
              duration: "Month 4–14",
              lag: 0.20
            }
          ].map((card, idx) => (
            <LagItem
              key={idx}
              lag={card.lag}
              inertia={card.lag > 0}
              wrapperClassName="h-full"
              className="bg-surface border-t border-ink p-8 flex flex-col justify-between min-h-[340px]"
            >
              <div>
                <span className="font-dm-sans font-medium text-5xl md:text-6xl text-ink-muted tracking-[-2px] block mb-6">
                  {card.step}
                </span>
                <h4 className="font-dm-sans font-medium text-2xl tracking-tight text-ink mb-3">
                  {card.title}
                </h4>
                <p className="text-[15px] leading-relaxed text-ink-muted">
                  {card.body}
                </p>
              </div>
              <p className="mt-8 text-[12px] uppercase tracking-[0.48px] font-medium text-ink">
                {card.duration}
              </p>
            </LagItem>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIAL CAROUSEL */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="border-t border-ink pt-6 flex flex-col lg:flex-row gap-12 lg:gap-20 items-start justify-between">
          <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium shrink-0">
            (Client words)
          </p>

          <LagItem lag={0.08} inertia wrapperClassName="flex-1" className="flex flex-col gap-10">
            <blockquote className="font-dm-sans font-medium text-2xl sm:text-4xl md:text-5xl leading-tight tracking-[-1.2px] text-ink max-w-[960px]">
              “{testimonials[currentTestimonial].quote}”
            </blockquote>

            <div className="flex items-center justify-between pt-6 border-t border-line">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-stone-1 overflow-hidden shrink-0">
                  <img alt="" className="size-full object-cover" src={ASSETS.clientAvatar} />
                </div>
                <div>
                  <p className="font-medium text-[15px] text-ink">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-[14px] text-ink-muted">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
                  0{currentTestimonial + 1} / 0{testimonials.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="size-10 rounded-full border border-ink flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer"
                    aria-label="Previous review"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    className="size-10 rounded-full border border-ink flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer"
                    aria-label="Next review"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </LagItem>
        </div>
      </section>

      {/* 7. AREAS WE SERVE */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="border-t border-ink pt-6 flex flex-col gap-12">
          <div className="flex items-end justify-between">
            <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-6xl tracking-[-1.68px] text-ink">
              Areas we serve
            </h2>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
              (Kerala · Karnataka)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Wayanad Studio - goes at normal speed */}
            <LagItem lag={0} className="flex flex-col gap-4">
              <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
                Wayanad studio — Kalpetta
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Kalpetta", "Meppadi", "Vythiri", "Sulthan Bathery",
                  "Mananthavady", "Panamaram", "Ambalavayal", "Pulpally", "Meenangadi"
                ].map((place) => (
                  <span
                    key={place}
                    className="px-4 py-2 rounded-full border border-line text-[14px] font-medium text-ink bg-white hover:border-ink transition-colors cursor-default"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </LagItem>

            {/* Bengaluru Studio - lags behind */}
            <LagItem lag={0.12} inertia className="flex flex-col gap-4">
              <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
                Bengaluru studio — Jayanagar
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Jayanagar", "JP Nagar", "Basavanagudi", "Banashankari",
                  "BTM Layout", "HSR Layout", "Koramangala"
                ].map((place) => (
                  <span
                    key={place}
                    className="px-4 py-2 rounded-full border border-line text-[14px] font-medium text-ink bg-white hover:border-ink transition-colors cursor-default"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </LagItem>
          </div>

          <p className="text-lg md:text-[22px] leading-[1.4] text-ink-muted tracking-[-0.22px] pt-4">
            Building somewhere else in Kerala or Karnataka? Ask us — we travel for the right project.
          </p>
        </div>
      </section>

      {/* 8. JOURNAL / INSIGHTS */}
      <section id="journal-section" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="border-t border-ink pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-2">
              (Insights)
            </p>
            <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-6xl tracking-[-1.68px] text-ink">
              From the journal
            </h2>
          </div>
          <button
            onClick={() => onNavigate('journal')}
            className="group self-start inline-flex items-center gap-3 border-b border-ink pb-1.5 text-[15px] font-medium text-ink hover:text-neutral-600 transition-colors cursor-pointer"
          >
            <span>See all articles</span>
            <img alt="" className="size-4 transition-transform duration-200 group-hover:translate-x-1" src={ASSETS.iconArrowRightDark} />
          </button>
        </div>

        <div className="flex flex-col">
          {[
            {
              title: "How much does it cost to build a house in Wayanad in 2026?",
              date: "Oct 2026"
            },
            {
              title: "Designing a Kerala home for the monsoon: Slope, roof overhangs & stone",
              date: "Sep 2026"
            },
            {
              title: "Building permits in Kerala, step by step: From Panchayath to occupancy",
              date: "Aug 2026"
            }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => (i === 0 ? onNavigate('article') : onNavigate('journal'))}
              className="group border-t border-line py-8 flex items-center justify-between gap-6 cursor-pointer hover:border-ink transition-colors"
            >
              <h4 className="font-dm-sans font-medium text-xl sm:text-2xl md:text-3xl text-ink tracking-tight group-hover:text-accent transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-6 shrink-0">
                <span className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
                  {item.date}
                </span>
                <span className="text-2xl text-ink transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </div>
            </div>
          ))}
          <div className="border-t border-line" />
        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="border-t border-ink pt-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column Sticky */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
              (FAQ)
            </p>
            <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-6xl tracking-[-1.68px] leading-tight text-ink">
              Questions,<br />answered
            </h2>

            <LagItem lag={0.12} inertia className="bg-surface p-6 flex flex-col gap-3 mt-4">
              <p className="font-medium text-[15px] text-ink">
                Still have questions?
              </p>
              <p className="text-[15px] text-ink-muted leading-relaxed">
                We are happy to jump on a quick call or welcome you to our studios in Kalpetta or Jayanagar.
              </p>
              <button
                onClick={() => onNavigate('studio')}
                className="mt-2 text-left font-medium text-[14px] text-accent hover:underline"
              >
                Reach out directly →
              </button>
            </LagItem>
          </div>

          {/* Right Column Accordion Items */}
          <div className="lg:col-span-8 flex flex-col">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border-t border-line py-6 flex flex-col transition-colors cursor-pointer"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-dm-sans text-xl sm:text-2xl text-ink tracking-tight">
                      {faq.q}
                    </h3>
                    <div className="size-6 shrink-0 flex items-center justify-center">
                      <img
                        alt=""
                        className="size-5 transition-transform duration-200"
                        src={isOpen ? ASSETS.iconMinus : ASSETS.iconPlus}
                      />
                    </div>
                  </div>

                  {isOpen && (
                    <p className="mt-4 text-[16px] text-ink-muted leading-relaxed max-w-[700px] animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
            <div className="border-t border-line" />
          </div>
        </div>
      </section>
    </div>
  );
};
