import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ASSETS } from '../constants/assets';
import { Aperture } from '../components/Aperture';
import { RouteLink } from '../components/RouteLink';
import { prefersReducedMotion } from '../context/SmoothScrollContext';
import { PROJECTS_DATA, type NavigateTarget } from '../data/projects';
import { RESEARCH_DATA } from '../data/research';

const SunStudy = lazy(() => import('../components/SunStudy'));

interface LandingPageProps {
  onNavigate: (target: NavigateTarget) => void;
  onOpenProject: (id: string) => void;
}

const TESTIMONIALS = [
  {
    quote: 'A space that feels completely natural to the Wayanad hillside. Rashid and his team understood the light and monsoon winds like no one else.',
    author: 'K. N. Chandran',
    role: 'Homeowner, Kalpetta',
  },
  {
    quote: 'Flowspace transformed our tight urban plot in Bengaluru into a tranquil sanctuary filled with courtyards and skylights. Exceptional detailing.',
    author: 'Pooja and Sameer Reddy',
    role: 'Residents, Jayanagar',
  },
  {
    quote: 'Their commitment to honest materials, local laterite, and climate responsiveness sets them apart. They delivered beyond our expectations.',
    author: 'Mathews Varghese',
    role: 'Estate owner, Vythiri',
  },
  {
    quote: 'Working with Rashid was a collaborative joy. The house breathes and stays cool even in peak summer without active cooling.',
    author: 'Ananya Swaminathan',
    role: 'Homeowner, Bengaluru',
  },
];

// Positions in months from the first site visit; durations are written as lengths so they never fight the axis
const PROCESS = [
  { title: 'Site visit and brief', body: 'We walk the plot with you, listen to how your family lives, and agree a budget before a single line is drawn.', duration: '2 weeks', start: 0, end: 0.5 },
  { title: 'Concept and form', body: 'We find the story the site and your brief suggest, then test it through light, ventilation and circulation studies and 3D massing, presented with material samples.', duration: '4 weeks', start: 0.5, end: 1.5 },
  { title: 'Detailing and approvals', body: 'Complete structural, electrical, and plumbing documentation alongside municipality clearances in Kerala and Karnataka.', duration: '6 weeks', start: 1.5, end: 3 },
  { title: 'Realization', body: 'Periodic on-site supervision, artisan collaboration, and handover with full post-occupancy care.', duration: '11 months', start: 3, end: 14 },
];
const PROCESS_SPAN = 14;
// Design and approvals (months 0–3) get the left half of the bar and building the right half:
// on one linear scale the first two steps were only a few pixels wide
const PROCESS_BREAK = 3;
const processX = (month: number) =>
  month <= PROCESS_BREAK
    ? (month / PROCESS_BREAK) * 50
    : 50 + ((month - PROCESS_BREAK) / (PROCESS_SPAN - PROCESS_BREAK)) * 50;

const FAQS = [
  { q: 'How long does it take to design and build a house?', a: 'Typically 12 to 18 months depending on scale. Concept and approvals take 3–4 months, with 9–14 months of supervised construction.' },
  { q: 'What are your architectural design fees?', a: 'Our fee structure is transparent, calculated either as a percentage of construction cost (typically 7–10%) or a fixed square-foot rate based on project complexity.' },
  { q: 'Do you handle construction supervision?', a: 'Yes, we offer comprehensive site supervision and periodic inspection to ensure that materials, tolerances, and design intent are executed faithfully.' },
  { q: 'Can you work on projects outside Wayanad and Bengaluru?', a: 'Yes, we undertake select residential and hospitality projects across Kerala, Karnataka, and Tamil Nadu when the site and vision align.' },
];

const JOURNAL = [
  // The cost guide has its own page; the others open in the Journal's reader
  { title: 'How much does it cost to build a house in Wayanad in 2026?', date: 'Oct 2026', href: '#/article' },
  { title: 'Designing a Kerala home for the monsoon: slope, roof overhangs and stone', date: 'Sep 2026', href: '#/journal/kerala-monsoon-design' },
  { title: 'Building permits in Kerala, step by step: from panchayat to occupancy', date: 'Aug 2026', href: '#/journal/kerala-building-permits' },
];

const PLACES = {
  wayanad: ['Kalpetta', 'Meppadi', 'Vythiri', 'Sulthan Bathery', 'Mananthavady', 'Panamaram', 'Ambalavayal', 'Pulpally', 'Meenangadi'],
  bengaluru: ['Jayanagar', 'JP Nagar', 'Basavanagudi', 'Banashankari', 'BTM Layout', 'HSR Layout', 'Koramangala'],
};

// Selected work on the home page: wide, then narrow and offset right, then wide again
const WORK_LAYOUT = [
  { col: 'md:col-span-9', aspect: 'aspect-[4/3] md:aspect-[16/10]', wide: true },
  { col: 'md:col-start-7 md:col-span-5', aspect: 'aspect-[4/5]', wide: false },
  { col: 'md:col-start-2 md:col-span-10', aspect: 'aspect-[4/3] md:aspect-[16/9]', wide: true },
];

const HEADLINE = ['Spaces that speak', 'for themselves.'];
const HEADLINE_NARROW = ['Spaces that', 'speak for', 'themselves.'];

/* -------------------------------------------------------------------------- */

const Hero: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [reduced] = useState(prefersReducedMotion);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      // On load: the headline rises line by line beside the small courtyard window
      gsap.from('[data-hero-line]', { yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.15 });
      gsap.from('[data-hero-intro], [data-hero-pre]', { autoAlpha: 0, duration: 0.9, ease: 'power2.out', delay: 0.5 });

      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (c) => {
        const { desktop } = c.conditions as { desktop: boolean };
        const opening = desktop ? 'inset(12% 11% 38% 61% round 0px)' : 'inset(57% 6% 7% 36% round 0px)';

        // One move on scroll: the window opens to the full sky while the headline lifts away
        gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '+=70%', scrub: 0.6, pin: true, pinSpacing: true },
        })
          .fromTo('[data-hero-aperture]', { clipPath: opening }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, 0)
          .fromTo('[data-hero-image]', { scale: 1.15 }, { scale: 1, duration: 1 }, 0)
          .to('[data-hero-copy]', { yPercent: -30, autoAlpha: 0, ease: 'power1.in', duration: 0.5 }, 0)
          .to('[data-hero-pre]', { autoAlpha: 0, duration: 0.2 }, 0)
          .fromTo('[data-hero-post]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.75);
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section className="pt-[120px] md:pt-[140px]">
        <div className="page-x grid-page gap-y-8 pb-10">
          <p className="col-span-12 md:col-span-4 label max-w-[30ch]">
            Architecture, interiors and landscape from Kalpetta, Wayanad and Jayanagar, Bengaluru.
          </p>
          <h1 className="col-span-12 display text-[15vw] md:text-[9.5vw]">
            {HEADLINE.map((l) => <span key={l} className="block">{l}</span>)}
          </h1>
        </div>
        <div className="relative h-[80svh]">
          <img src={ASSETS.heroBg} alt="Double-height living room opening onto a garden courtyard" className="absolute inset-0 size-full object-cover object-[22%_50%] md:object-center" />
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[100svh] overflow-hidden bg-lime" aria-label="Introduction">
      {/* Aperture: the full-bleed image, clipped to a small opening until the visitor scrolls */}
      <div data-hero-aperture className="absolute inset-0 will-change-[clip-path] [clip-path:inset(57%_6%_7%_36%)] md:[clip-path:inset(12%_11%_38%_61%)]">
        <img
          data-hero-image
          src={ASSETS.heroBg}
          alt="Double-height living room opening onto a garden courtyard"
          {...{ fetchpriority: 'high' }}
          className="absolute inset-0 size-full object-cover object-[22%_50%] md:object-center"
        />
        {/* A soft foot shadow only, so the caption reads without dimming the render */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
        <p data-hero-post className="absolute left-[var(--gutter)] bottom-6 md:bottom-8 text-[13px] text-white opacity-0 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
          Courtyard residence, Wayanad. Design visualisation.
        </p>
      </div>

      <div data-hero-copy className="relative z-10 h-full page-x pt-[96px] md:pt-[120px] pb-8 md:pb-10 flex flex-col justify-between pointer-events-none">
        <p data-hero-intro className="label max-w-[30ch] md:max-w-[34ch]">
          Architecture, interiors and landscape from Kalpetta, Wayanad and Jayanagar, Bengaluru. Led by Chief Architect Ar.&nbsp;Rashid&nbsp;Ali.
        </p>
        <h1 className="display text-[16vw] md:text-[9.6vw] max-md:mb-[44svh]">
          <span className="sr-only">{HEADLINE.join(' ')}</span>
          {HEADLINE.map((l) => (
            <span key={l} aria-hidden="true" className="line-mask max-md:hidden"><span data-hero-line className="block">{l}</span></span>
          ))}
          {HEADLINE_NARROW.map((l) => (
            <span key={l} aria-hidden="true" className="line-mask md:hidden"><span data-hero-line className="block">{l}</span></span>
          ))}
        </h1>
      </div>

      <p data-hero-pre className="hidden md:block absolute z-10 left-[61%] top-[calc(62%+0.75rem)] label">
        Courtyard residence, Wayanad
      </p>
    </section>
  );
};

/* -------------------------------------------------------------------------- */

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [current, setCurrent] = useState(0);
  const t = TESTIMONIALS[current];

  // The 3D model (and three.js) is fetched only when the visitor gets near it
  const sunRef = useRef<HTMLDivElement>(null);
  const [showSun, setShowSun] = useState(false);
  useEffect(() => {
    const el = sunRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShowSun(true); io.disconnect(); }
    }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Block layout on purpose: GSAP disables pin spacing when the pinned hero's parent is flex
    <div>
      <Hero />

      {/* Studio */}
      <section className="page-x pt-28 md:pt-44 pb-24 md:pb-36" aria-labelledby="studio-heading">
        <div className="grid-page gap-y-10">
          <h2 id="studio-heading" className="col-span-12 md:col-span-3 label pt-2">The studio</h2>
          <div className="col-span-12 md:col-span-9 lg:col-span-8">
            <p className="prose-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.12]">
              We draw every building as boxes and lines: a box for each part of life, and flowing lines of movement, light and air weaving through them all.
            </p>
            <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              Flowspace Architects is an architecture and design studio led by Chief Architect Ar. Rashid Ali, working across architecture, interiors, landscape, master planning and research from Wayanad and Bengaluru.
            </p>
            <a href="#/studio" className="text-link mt-8 text-[15px]">About the studio</a>
          </div>
        </div>

        <dl className="grid-page gap-y-0 mt-20 md:mt-28 text-[15px]">
          {[
            ['Studios', 'Kalpetta, Wayanad and Jayanagar, Bengaluru'],
            ['Services', 'Over twenty, from house plans to conservation and urban work'],
            ['Project types', 'Homes from budget to weekend retreats, apartments, resorts and eco villages, cafés, breweries and club houses, retail, interiors and furniture'],
            ['Honours', 'Design & Vision Firm of the Year 2026, South India; Vanitha Veedu Young Architect Award; FOAID Design Week'],
          ].map(([term, desc]) => (
            <div key={term} className="col-span-12 md:col-start-4 md:col-span-9 grid grid-cols-[8.5rem_1fr] sm:grid-cols-[11rem_1fr] gap-4 border-t border-line py-4">
              <dt className="text-ink-muted">{term}</dt>
              <dd>
                {term === 'Honours' ? <a href="#/press" className="hover:text-accent transition-colors">{desc}</a> : desc}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Selected work */}
      <section className="pb-28 md:pb-44" aria-labelledby="work-heading">
        <div className="page-x grid-page items-baseline mb-10 md:mb-14">
          <h2 id="work-heading" className="col-span-6 md:col-span-3 label">Selected work</h2>
          <a href="#/projects" className="col-span-6 md:col-span-9 justify-self-end text-link text-[15px] whitespace-nowrap">All projects ({PROJECTS_DATA.length})</a>
        </div>

        {/* Wide, narrow and offset, wide: unequal frames give rhythm; captions sit below, never on the image */}
        <ul className="page-x grid-page gap-y-20 md:gap-y-32">
          {PROJECTS_DATA.slice(0, 3).map((project, i) => {
            const layout = WORK_LAYOUT[i];
            return (
              <li key={project.id} className={`col-span-12 ${layout.col}`}>
                <a href={`#/project/${project.id}`} className="group block">
                  <Aperture
                    src={project.image}
                    alt={project.title}
                    focus={project.focus}
                    className={layout.aspect}
                    imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
                  />
                  <div className={`mt-5 grid grid-cols-1 gap-x-10 gap-y-3 ${layout.wide ? 'sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]' : ''}`}>
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-[22px] md:text-[26px] tracking-tight transition-colors group-hover:text-accent">{project.title}</h3>
                        <span className="label tabular-nums sm:hidden">{project.year}</span>
                      </div>
                      <p className="label mt-1">{project.location}<span className="max-sm:hidden">, {project.year}</span></p>
                    </div>
                    <p className="prose-serif text-[18px] md:text-[20px] leading-[1.35] max-w-[42ch]">{project.description}</p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Sun study: a model to turn, under the real sun for Wayanad */}
      <section className="page-x pb-28 md:pb-44" aria-labelledby="sun-heading">
        <div className="grid-page gap-y-10">
          <h2 id="sun-heading" className="col-span-12 md:col-span-3 label pt-2">Sun study</h2>
          <div className="col-span-12 md:col-span-9">
            <p className="prose-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.12] max-w-[22ch]">
              Deep eaves and a courtyard, through a day of sun.
            </p>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              A courtyard house at Wayanad’s latitude. Move the time and the season to see where the shade falls.
            </p>
            <div ref={sunRef} className="mt-10 md:mt-14">
              {showSun ? (
                <Suspense fallback={<div className="w-full aspect-square sm:aspect-[16/10]" />}>
                  <SunStudy />
                </Suspense>
              ) : (
                <div className="w-full aspect-square sm:aspect-[16/10]" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process: a real sequence on a shared axis, with the design months drawn larger */}
      <section className="page-x pb-28 md:pb-44" aria-labelledby="process-heading">
        <div className="grid-page gap-y-10 mb-14 md:mb-20">
          <h2 id="process-heading" className="col-span-12 md:col-span-3 label pt-2">Process</h2>
          <div className="col-span-12 md:col-span-9 lg:col-span-8">
            <p className="prose-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.12]">From idea to built form.</p>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              A typical house takes about fourteen months from first site visit to handover. Most of that is building.
            </p>
          </div>
        </div>

        <ol>
          {PROCESS.map((step, i) => (
            <li key={step.title} className="grid-page gap-y-3 border-t border-line py-6 md:py-8">
              <span className="col-span-1 text-[15px] text-ink-muted tabular-nums">{i + 1}</span>
              <div className="col-span-11 md:col-span-3">
                <h3 className="text-[20px] md:text-[22px] tracking-tight">{step.title}</h3>
                <p className="label mt-1">{step.duration}</p>
              </div>
              <p className="col-span-11 col-start-2 md:col-span-4 text-[15px] leading-relaxed text-ink-muted max-w-[46ch]">{step.body}</p>
              <div className="col-span-11 col-start-2 md:col-span-4 md:self-center relative h-2 mt-2 md:mt-0" aria-hidden="true">
                {/* Two track segments with a gap at the scale change */}
                <div className="absolute inset-y-[3px] left-0 right-[calc(50%+3px)] bg-stone-1" />
                <div className="absolute inset-y-[3px] left-[calc(50%+3px)] right-0 bg-stone-1" />
                <div
                  className="absolute inset-y-0 bg-ink"
                  style={{ left: `${processX(step.start)}%`, width: `${processX(step.end) - processX(step.start)}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
        <div className="grid-page" aria-hidden="true">
          <div className="col-span-11 col-start-2 md:col-start-9 md:col-span-4 relative h-7 label border-t border-line">
            <span className="absolute left-0 top-2">Start</span>
            <span className="absolute left-1/2 top-2 -translate-x-1/2">Month 3</span>
            <span className="absolute right-0 top-2">Month 14</span>
          </div>
          <p className="col-span-11 col-start-2 md:col-start-9 md:col-span-4 label mt-2">
            The first three months are drawn at a larger scale.
          </p>
        </div>
      </section>

      {/* Client words */}
      <section className="bg-plaster page-x py-24 md:py-36" aria-labelledby="clients-heading">
        <div className="grid-page gap-y-10">
          <h2 id="clients-heading" className="col-span-12 md:col-span-3 label pt-3">Client words</h2>
          <figure className="col-span-12 md:col-span-9 lg:col-span-8" aria-live="polite">
            <blockquote key={current} className="prose-serif text-[26px] sm:text-[36px] lg:text-[44px] leading-[1.18] animate-in">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-5">
              <div className="text-[15px]">
                <p>{t.author}</p>
                <p className="text-ink-muted">{t.role}</p>
              </div>
              <div className="flex items-center gap-6 text-[15px]">
                <span className="text-ink-muted tabular-nums">{current + 1} of {TESTIMONIALS.length}</span>
                <button onClick={() => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1))} className="text-link">Previous</button>
                <button onClick={() => setCurrent((c) => (c + 1) % TESTIMONIALS.length)} className="text-link">Next</button>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Where we work */}
      <section className="page-x py-28 md:py-44" aria-labelledby="areas-heading">
        <div className="grid-page gap-y-10">
          <h2 id="areas-heading" className="col-span-12 md:col-span-3 label pt-2">Where we work</h2>
          {([['Wayanad studio, Kalpetta', PLACES.wayanad], ['Bengaluru studio, Jayanagar', PLACES.bengaluru]] as const).map(([title, places]) => (
            <div key={title} className="col-span-12 md:col-span-4 lg:col-span-4">
              <h3 className="text-[15px] text-ink-muted mb-4">{title}</h3>
              <p className="text-[24px] sm:text-[28px] leading-[1.3] tracking-tight font-light">{places.join(', ')}</p>
            </div>
          ))}
          <p className="col-span-12 md:col-start-4 md:col-span-8 text-[17px] text-ink-muted max-w-[52ch]">
            Building somewhere else in Kerala or Karnataka? Ask us. We travel for the right project.
          </p>
        </div>
      </section>

      {/* Research */}
      <section className="page-x pb-28 md:pb-44" aria-labelledby="research-heading">
        <div className="grid-page items-baseline mb-10 md:mb-14">
          <h2 id="research-heading" className="col-span-6 md:col-span-3 label">Research</h2>
          <a href="#/research" className="col-span-6 md:col-span-9 justify-self-end text-link text-[15px]">All research</a>
        </div>
        <ul className="grid-page gap-y-10">
          {RESEARCH_DATA.slice(0, 3).map((r) => (
            <li key={r.id} className="col-span-12 md:col-span-4">
              <a href={`#/research/${r.id}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-line">
                  <img src={r.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
                </div>
                <p className="label mt-4">{r.type}, {r.year}</p>
                <h3 className="mt-2 text-[20px] sm:text-[22px] leading-[1.2] tracking-tight transition-colors group-hover:text-accent">{r.title}</h3>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Journal */}
      <section className="page-x pb-28 md:pb-44" aria-labelledby="journal-heading">
        <div className="grid-page items-baseline mb-10 md:mb-14">
          <h2 id="journal-heading" className="col-span-6 md:col-span-3 label">Journal</h2>
          <a href="#/journal" className="col-span-6 md:col-span-9 justify-self-end text-link text-[15px]">All articles</a>
        </div>
        <ul className="border-b border-line">
          {JOURNAL.map((item) => (
            <li key={item.title} className="border-t border-line">
              <a href={item.href} className="group grid-page gap-y-2 py-6 md:py-8 items-baseline">
                <span className="col-span-12 md:col-span-3 label">{item.date}</span>
                <span className="col-span-12 md:col-span-9 text-[22px] sm:text-[28px] lg:text-[32px] leading-[1.2] tracking-tight transition-colors group-hover:text-accent">
                  {item.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Questions */}
      <section className="page-x pb-32 md:pb-48" aria-labelledby="faq-heading">
        <div className="grid-page gap-y-10">
          <div className="col-span-12 md:col-span-3">
            <h2 id="faq-heading" className="label pt-2">Questions</h2>
            <p className="mt-6 text-[15px] text-ink-muted max-w-[30ch] leading-relaxed">
              Happy to talk on a call, or welcome you to our studios in Kalpetta or Jayanagar.
            </p>
            <RouteLink to="contact" onNavigate={onNavigate} className="text-link mt-4 text-[15px]">Get in touch</RouteLink>
          </div>
          <div className="col-span-12 md:col-span-9 border-b border-line">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="border-t border-line">
                  <h3>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-${i}`}
                      className="w-full flex items-start justify-between gap-6 py-6 text-left text-[20px] sm:text-[24px] tracking-tight"
                    >
                      <span>{faq.q}</span>
                      <span aria-hidden="true" className={`relative mt-2.5 size-3.5 shrink-0 transition-transform duration-500 ease-out-expo ${open ? 'rotate-45' : ''}`}>
                        <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                        <span className="absolute inset-y-0 left-1/2 w-px bg-current" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <p className="overflow-hidden text-[16px] leading-relaxed text-ink-muted max-w-[62ch]">
                      <span className="block pb-7">{faq.a}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
