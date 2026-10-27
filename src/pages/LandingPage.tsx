import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ASSETS } from '../constants/assets';
import { Aperture } from '../components/Aperture';
import { prefersReducedMotion } from '../context/SmoothScrollContext';
import { PROJECTS_DATA, type NavigateTarget } from '../data/projects';

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

// Durations on a shared axis, in months from the first site visit
const PROCESS = [
  { title: 'Site visit and brief', body: 'We walk the plot with you, listen to how your family lives, and agree a budget before a single line is drawn.', duration: 'Weeks 1–2', start: 0, end: 0.5 },
  { title: 'Concept and form', body: 'Climate orientation, spatial flow diagrams, and 3D massing presented with tangible material samples.', duration: 'Weeks 3–6', start: 0.5, end: 1.5 },
  { title: 'Detailing and approvals', body: 'Complete structural, electrical, and plumbing documentation alongside municipality clearances in Kerala and Karnataka.', duration: 'Months 2–3', start: 1.5, end: 3 },
  { title: 'Realization', body: 'Periodic on-site supervision, artisan collaboration, and handover with full post-occupancy care.', duration: 'Months 4–14', start: 3, end: 14 },
];
const PROCESS_SPAN = 14;

const FAQS = [
  { q: 'How long does it take to design and build a house?', a: 'Typically 12 to 18 months depending on scale. Concept and approvals take 3–4 months, with 9–14 months of supervised construction.' },
  { q: 'What are your architectural design fees?', a: 'Our fee structure is transparent, calculated either as a percentage of construction cost (typically 7–10%) or a fixed square-foot rate based on project complexity.' },
  { q: 'Do you handle construction supervision?', a: 'Yes, we offer comprehensive site supervision and periodic inspection to ensure that materials, tolerances, and design intent are executed faithfully.' },
  { q: 'Can you work on projects outside Wayanad and Bengaluru?', a: 'Yes, we undertake select residential and hospitality projects across Kerala, Karnataka, and Tamil Nadu when the site and vision align.' },
];

const JOURNAL = [
  { title: 'How much does it cost to build a house in Wayanad in 2026?', date: 'Oct 2026', target: 'article' as NavigateTarget },
  { title: 'Designing a Kerala home for the monsoon: slope, roof overhangs and stone', date: 'Sep 2026', target: 'journal' as NavigateTarget },
  { title: 'Building permits in Kerala, step by step: from panchayat to occupancy', date: 'Aug 2026', target: 'journal' as NavigateTarget },
];

const PLACES = {
  wayanad: ['Kalpetta', 'Meppadi', 'Vythiri', 'Sulthan Bathery', 'Mananthavady', 'Panamaram', 'Ambalavayal', 'Pulpally', 'Meenangadi'],
  bengaluru: ['Jayanagar', 'JP Nagar', 'Basavanagudi', 'Banashankari', 'BTM Layout', 'HSR Layout', 'Koramangala'],
};

const HEADLINE = ['Spaces that speak', 'for themselves.'];
const HEADLINE_NARROW = ['Spaces that', 'speak for', 'themselves.'];

/* -------------------------------------------------------------------------- */

const Hero: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [reduced] = useState(prefersReducedMotion);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      // Entrance: headline lines rise out of their masks
      gsap.from('[data-hero-line]', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.15 });
      gsap.from('[data-hero-fade]', { opacity: 0, duration: 1, ease: 'power2.out', delay: 0.6 });
      gsap.from('[data-hero-frame]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', delay: 0.25 });

      // Scroll: the courtyard opening widens to the full sky
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (c) => {
        const { desktop } = c.conditions as { desktop: boolean };
        const start = desktop ? 'inset(12% 11% 38% 61% round 0px)' : 'inset(57% 6% 7% 36% round 0px)';
        gsap.set('[data-hero-aperture]', { clipPath: start });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '+=140%', scrub: 0.8, pin: true, pinSpacing: true },
        });
        tl.to('[data-hero-aperture]', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
          .fromTo('[data-hero-image]', { scale: 1.22 }, { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
          .to('[data-hero-copy]', { yPercent: -40, opacity: 0, ease: 'power1.in', duration: 0.45 }, 0)
          .to('[data-hero-pre]', { opacity: 0, duration: 0.2 }, 0)
          .fromTo('[data-hero-post]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, 0.75);
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
          <img src={ASSETS.heroBg} alt="Double-height living room opening onto a garden courtyard" className="absolute inset-0 size-full object-cover" />
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[100svh] overflow-hidden bg-lime" aria-label="Introduction">
      {/* Aperture: the full-bleed image, clipped to a small opening at first */}
      <div data-hero-aperture className="absolute inset-0 will-change-[clip-path]">
        <div data-hero-frame className="absolute inset-0 overflow-hidden">
          <img
            data-hero-image
            src={ASSETS.heroBg}
            alt="Double-height living room opening onto a garden courtyard"
            {...{ fetchpriority: 'high' }}
            className="absolute left-0 top-0 w-[112%] h-[112%] max-w-none object-cover origin-top-left"
          />
        </div>
        <p data-hero-post className="absolute left-[var(--gutter)] bottom-6 md:bottom-8 text-[13px] text-lime opacity-0 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
          Courtyard residence, Wayanad. Design visualisation.
        </p>
      </div>

      <div data-hero-copy className="relative z-10 h-full page-x pt-[96px] md:pt-[120px] pb-8 md:pb-10 flex flex-col justify-between pointer-events-none">
        <p data-hero-fade className="label max-w-[30ch] md:max-w-[34ch] text-ink">
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
  const [cloud, terra, courtyard] = PROJECTS_DATA;
  const t = TESTIMONIALS[current];

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
              A space should speak for itself, without any description. We let form follow function, and function follow the people who live in it.
            </p>
            <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              Flowspace Architects is an architecture and design studio led by Chief Architect Ar. Rashid Ali, designing homes, workplaces and interiors from Wayanad and Bengaluru.
            </p>
            <a href="#/studio" className="text-link mt-8 text-[15px]">About the studio</a>
          </div>
        </div>

        <dl className="grid-page gap-y-0 mt-20 md:mt-28 text-[15px]">
          {[
            ['Studios', 'Kalpetta, Wayanad and Jayanagar, Bengaluru'],
            ['Services', 'Over twenty, from house plans to conservation and urban work'],
            ['Project types', 'Homes, apartments, commercial, retail, interiors and furniture'],
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
      <section className="page-x pb-28 md:pb-44" aria-labelledby="work-heading">
        <div className="grid-page items-end mb-12 md:mb-20">
          <h2 id="work-heading" className="col-span-8 display text-[44px] sm:text-[64px] lg:text-[88px]">Selected work</h2>
          <a href="#/projects" className="col-span-4 justify-self-end text-link text-[15px] mb-2">All projects ({PROJECTS_DATA.length})</a>
        </div>

        <div className="flex flex-col gap-24 md:gap-40">
          {/* Wide, caption to the right */}
          <a href={`#/project/${cloud.id}`} className="group grid-page gap-y-5 items-end">
            <Aperture src={cloud.image} alt={cloud.title} focus={cloud.focus} className="col-span-12 md:col-span-9 aspect-[16/10]" imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]" />
            <ProjectCaption project={cloud} className="col-span-12 md:col-span-3" />
          </a>

          {/* Narrow and offset, caption to the left */}
          <a href={`#/project/${courtyard.id}`} className="group grid-page gap-y-5 items-end">
            <ProjectCaption project={courtyard} className="col-span-12 md:col-span-4 lg:col-span-3 md:col-start-2 lg:col-start-3 order-2 md:order-1" />
            <Aperture src={courtyard.image} alt={courtyard.title} className="col-span-12 md:col-span-6 lg:col-span-5 md:col-start-7 lg:col-start-7 aspect-[4/5] order-1 md:order-2" imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]" />
          </a>

          {/* Wide again, caption below */}
          <a href={`#/project/${terra.id}`} className="group grid-page gap-y-5">
            <Aperture src={terra.image} alt={terra.title} className="col-span-12 md:col-start-3 md:col-span-10 aspect-[16/9]" imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]" />
            <ProjectCaption project={terra} className="col-span-12 md:col-start-3 md:col-span-5" />
          </a>
        </div>
      </section>

      {/* Process: a real sequence, drawn on a shared fourteen-month axis */}
      <section className="page-x pb-28 md:pb-44" aria-labelledby="process-heading">
        <div className="grid-page gap-y-6 mb-12 md:mb-16">
          <h2 id="process-heading" className="col-span-12 md:col-span-8 display text-[44px] sm:text-[64px] lg:text-[88px]">From idea to built form</h2>
          <p className="col-span-12 md:col-span-4 md:self-end text-[15px] text-ink-muted max-w-[38ch]">
            A typical house takes about fourteen months from first site visit to handover. Most of that is building.
          </p>
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
                <div className="absolute inset-y-[3px] left-0 right-0 bg-stone-1" />
                <div
                  className="absolute inset-y-0 bg-ink"
                  style={{ left: `${(step.start / PROCESS_SPAN) * 100}%`, width: `${((step.end - step.start) / PROCESS_SPAN) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
        <div className="grid-page" aria-hidden="true">
          <div className="col-span-11 col-start-2 md:col-start-9 md:col-span-4 flex justify-between label border-t border-line pt-2">
            <span>Month 0</span><span>7</span><span>14</span>
          </div>
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

      {/* Journal */}
      <section className="page-x pb-28 md:pb-44" aria-labelledby="journal-heading">
        <div className="grid-page items-end mb-10 md:mb-14">
          <h2 id="journal-heading" className="col-span-8 display text-[44px] sm:text-[64px] lg:text-[88px]">Journal</h2>
          <a href="#/journal" className="col-span-4 justify-self-end text-link text-[15px] mb-2">All articles</a>
        </div>
        <ul className="border-b border-line">
          {JOURNAL.map((item) => (
            <li key={item.title} className="border-t border-line">
              <a href={`#/${item.target}`} className="group grid-page gap-y-2 py-6 md:py-8 items-baseline">
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
            <button onClick={() => onNavigate('contact')} className="text-link mt-4 text-[15px]">Get in touch</button>
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

const ProjectCaption: React.FC<{ project: (typeof PROJECTS_DATA)[number]; className?: string }> = ({ project, className = '' }) => (
  <div className={className}>
    <h3 className="text-[24px] md:text-[28px] tracking-tight leading-tight group-hover:text-accent transition-colors">{project.title}</h3>
    <p className="label mt-1">{project.location}, {project.year}</p>
    <p className="prose-serif text-[17px] leading-snug mt-4 max-w-[34ch] text-ink/80">{project.description}</p>
  </div>
);
