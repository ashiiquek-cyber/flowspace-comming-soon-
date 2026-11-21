import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ASSETS, srcSet } from '../constants/assets';
import { ProjectReel } from '../components/ProjectReel';
import { RouteLink } from '../components/RouteLink';
import { prefersReducedMotion } from '../context/SmoothScrollContext';
import { PROJECTS_DATA, type NavigateTarget } from '../data/projects';
import { RESEARCH_DATA } from '../data/research';
import { MovingEmblem } from '../components/Brand';
import { setHeroState } from '../lib/heroSignal';
import { BoxMarker, BoxStack } from '../components/Massing';
import { WordFill } from '../components/TextMotion';

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
  { title: 'Concept and form', body: 'We find the story the site and your brief suggest, then shape it around light, ventilation, circulation, water and Vastu, tested in 3D massing and presented with material samples.', duration: '4 weeks', start: 0.5, end: 1.5 },
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

// One rhythm for the whole page: each section's top gap, and the gap from its label row to its content
const SECTION = 'page-x pt-16 md:pt-24';

/** A section label with its box marker, sitting in the narrow left column */
const SectionLabel: React.FC<{ id: string; className?: string; children: React.ReactNode }> = ({ id, className = '', children }) => (
  <h2 id={id} className={`label flex items-center gap-2.5 self-start ${className}`}>
    <BoxMarker />
    {children}
  </h2>
);

const HEADLINE = ['Spaces that speak', 'for themselves.'];
const HEADLINE_NARROW = ['Spaces that', 'speak for', 'themselves.'];

// The gallery the hero settles into: the courtyard as the centre box, four other projects around it.
// Phones keep the first two, so the scatter never crowds the centre
const HERO_GALLERY = PROJECTS_DATA.filter((p) => p.image !== ASSETS.heroBg).slice(0, 4);
// Desktop boxes are large enough to fill the screen around the centre box, with no wide empty bands
const HERO_CARD_LAYOUT = [
  'left-[6%] top-[11.5%] w-[42%] aspect-[4/3] md:left-[4%] md:top-[14%] md:w-[26%]',
  'right-[6%] top-[78%] w-[40%] aspect-[4/3] md:right-auto md:left-[9%] md:top-[55%] md:w-[21%] md:aspect-[5/4]',
  'max-md:hidden left-[69%] top-[12%] w-[23%] aspect-[4/3]',
  'max-md:hidden left-[70%] top-[49%] w-[26%] aspect-[16/10]',
];
const HERO_MARQUEE = 'Flowspace Architects · Wayanad · Bengaluru · ';

/* -------------------------------------------------------------------------- */

const Hero: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [reduced] = useState(prefersReducedMotion);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    const root = rootRef.current;
    const navEmblem = document.querySelector<HTMLElement>('[data-nav-emblem]');
    const navWordmark = document.querySelector<HTMLElement>('[data-nav-wordmark]');
    const header = document.querySelector<HTMLElement>('header');

    // Before first paint: the emblem is centre stage, the navbar waits for it
    setHeroState({ docked: false, gathered: false }, false);

    const ctx = gsap.context(() => {
      // The entrance runs on the wrapper so it never fights the dock over the emblem's own opacity and scale
      gsap.from('[data-hero-emblem-wrap]', { autoAlpha: 0, scale: 0.94, duration: 1.4, ease: 'expo.out', delay: 0.1 });

      // Where the navbar's emblem sits, relative to the centre of the (unscrolled) hero
      const dock = () => {
        const nav = navEmblem!.getBoundingClientRect();
        const top = header ? header.getBoundingClientRect().top : 0;
        const big = root.querySelector<HTMLElement>('[data-hero-emblem]')!;
        return {
          x: nav.left + nav.width / 2 - root.clientWidth / 2,
          y: nav.top - top + nav.height / 2 - root.clientHeight / 2,
          scale: nav.width / big.offsetWidth,
        };
      };

      // How far the intro line drops to sit in the bottom-left corner before the dock
      const liftFrom = () => {
        const line = root.querySelector<HTMLElement>('[data-hero-fade]')!;
        const bottomGap = window.innerWidth >= 768 ? 32 : 24;
        return root.clientHeight - bottomGap - (line.offsetTop + line.offsetHeight);
      };

      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (c) => {
        const { desktop } = c.conditions as { desktop: boolean };
        const opening = desktop ? 'inset(12% 11% 38% 61% round 0px)' : 'inset(57% 6% 7% 36% round 0px)';
        // Stage 2's centre box, which the other projects gather around
        const centre = desktop ? 'inset(14% 34% 16% 34% round 0px)' : 'inset(27% 18% 27% 18% round 0px)';
        gsap.set('[data-hero-aperture]', { clipPath: 'inset(0% 0% 0% 0% round 0px)' });
        if (navEmblem && navWordmark) gsap.set([navEmblem, navWordmark], { autoAlpha: 0 });

        // Stage 1 is played, not scrubbed: the first nudge of the wheel docks the emblem
        // and lifts the intro line from the bottom-left corner to its place under the bar
        const DOCKED_AT = 0.9;
        const dockTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
        dockTl
          .fromTo('[data-hero-emblem]', { x: 0, y: 0, scale: 1 }, { x: () => dock().x, y: () => dock().y, scale: () => dock().scale, duration: DOCKED_AT }, 0)
          .fromTo('[data-hero-fade]', { y: () => liftFrom() }, { y: 0, duration: DOCKED_AT }, 0);
        // The hand-over swaps are explicit fromTo pairs rather than .set(), which would restore whatever
        // opacity it happened to record (mid-entrance, or hidden after a refresh while docked) on the way back.
        // Their start values render up front (they match the page as it loads), so an invalidate can't leave
        // them uninitialised and skipped on the way back
        if (navEmblem && navWordmark) {
          const swap = { duration: 0.01, ease: 'none' };
          dockTl
            .fromTo('[data-hero-emblem]', { autoAlpha: 1 }, { autoAlpha: 0, ...swap }, DOCKED_AT)
            .fromTo(navEmblem, { autoAlpha: 0 }, { autoAlpha: 1, ...swap }, DOCKED_AT)
            .fromTo(navWordmark, { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power2.out' }, DOCKED_AT);
        }
        dockTl.eventCallback('onComplete', () => setHeroState({ docked: true }));

        // Timeline units: 0–0.8 headline and window arrive, 1.1–2.1 the window becomes the centre box of a gallery
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=170%',
            scrub: 0.8,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
            onToggle: (self) => setHeroState({ active: self.isActive }),
            onUpdate: (self) => {
              // The navbar links gather alongside the emblem's flight, so signal at the start
              if (self.scroll() - self.start > 1) {
                if (dockTl.reversed() || dockTl.progress() === 0) {
                  setHeroState({ gathered: true });
                  dockTl.play();
                }
              } else if (dockTl.progress() > 0 && !dockTl.reversed()) {
                setHeroState({ docked: false, gathered: false });
                dockTl.reverse();
              }
            },
            // Re-measure both ends of the dock; the round trip forces a render at the current spot
            onRefresh: () => {
              const p = dockTl.progress();
              dockTl.invalidate().progress(p === 1 ? 0 : 1, true).progress(p, true);
            },
          },
        });

        // The full-bleed courtyard settles back into its small window; the scrim lifts as it goes
        tl.fromTo('[data-hero-aperture]', { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: opening, ease: 'power2.inOut', duration: 0.9 }, 0)
          .fromTo('[data-hero-image]', { scale: 1 }, { scale: 1.22, ease: 'power2.inOut', duration: 0.9 }, 0)
          .to('[data-hero-scrim]', { autoAlpha: 0, duration: 0.9, ease: 'power1.inOut' }, 0)
          .fromTo('[data-hero-emblem], [data-hero-fade]', { color: '#ffffff' }, { color: '#1d201e', duration: 0.9, ease: 'power1.inOut' }, 0)
          // The headline stays out of the opening view and arrives once the window has settled
          .fromTo('[data-hero-line]', { yPercent: 105 }, { yPercent: 0, ease: 'power3.out', stagger: 0.08, duration: 0.5 }, 0.5)
          .fromTo('[data-hero-pre]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.7);

        // Stage 2: the window moves to the centre and the other projects gather round it as boxes,
        // with the studio's name passing faintly underneath
        const S2 = 1.1;
        tl.to('[data-hero-aperture]', { clipPath: centre, ease: 'power2.inOut', duration: 0.65 }, S2)
          .fromTo('[data-hero-image]', { scale: 1.22 }, { scale: 1.08, ease: 'power2.inOut', duration: 0.65 }, S2)
          .to('[data-hero-copy]', { yPercent: -40, autoAlpha: 0, ease: 'power1.in', duration: 0.4 }, S2)
          .to('[data-hero-pre]', { autoAlpha: 0, duration: 0.2 }, S2)
          .fromTo('[data-hero-marquee]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, S2 + 0.15)
          .fromTo('[data-hero-card]', { autoAlpha: 0, y: 80, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, ease: 'power3.out', stagger: 0.08, duration: 0.5 }, S2 + 0.25)
          .fromTo('[data-hero-post]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, S2 + 0.7);

        return () => {
          if (navEmblem && navWordmark) gsap.set([navEmblem, navWordmark], { clearProps: 'all' });
        };
      });
    }, rootRef);

    return () => {
      ctx.revert();
      setHeroState({ active: false, docked: true, gathered: true }, false);
    };
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
          <img src={ASSETS.heroBg} srcSet={srcSet(ASSETS.heroBg)} sizes="(max-width: 767px) 200vw, 100vw" alt="Double-height living room opening onto a garden courtyard" className="absolute inset-0 size-full object-cover object-[22%_50%] md:object-center" />
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[100svh] overflow-hidden bg-lime" aria-label="Introduction">
      {/* Stage 2 ground: the studio's name passing faintly under the boxes */}
      <div data-hero-marquee aria-hidden="true" className="invisible absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none select-none">
        <div className="hero-marquee flex w-max whitespace-nowrap display text-ink/[0.06] text-[34vw] md:text-[21vw]">
          <span className="pr-[0.25em]">{HERO_MARQUEE}</span>
          <span className="pr-[0.25em]">{HERO_MARQUEE}</span>
        </div>
      </div>

      {/* Aperture: the full-bleed image, clipped to a small opening at first */}
      <div data-hero-aperture className="absolute inset-0 will-change-[clip-path]">
        <div data-hero-frame className="absolute inset-0 overflow-hidden">
          <img
            data-hero-image
            src={ASSETS.heroBg}
            srcSet={srcSet(ASSETS.heroBg)}
            // Matches the static first frame in index.html, so the browser reuses the same file
            sizes="(max-width: 767px) 240vh, 112vw"
            alt="Double-height living room opening onto a garden courtyard"
            {...{ fetchpriority: 'high' }}
            decoding="async"
            className="absolute left-0 top-0 w-[112%] h-[112%] max-w-none object-cover origin-top-left"
          />
          <div data-hero-scrim className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      {/* Stage 2: the other projects as boxes around the courtyard */}
      {HERO_GALLERY.map((p, i) => (
        <a
          key={p.id}
          href={`#/project/${p.id}`}
          data-hero-card
          aria-label={p.title}
          className={`invisible group absolute z-[5] ${HERO_CARD_LAYOUT[i]}`}
        >
          <span className="block size-full overflow-hidden bg-stone-1">
            <img
              src={p.image}
              srcSet={srcSet(p.image)}
              sizes="(max-width: 767px) 42vw, 20vw"
              alt=""
              decoding="async"
              style={{ objectPosition: p.focus }}
              className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
          </span>
          <span aria-hidden="true" className="max-md:hidden label block mt-2 text-ink transition-colors group-hover:text-accent">{p.title}</span>
        </a>
      ))}
      <p data-hero-post className="invisible absolute z-10 left-[18%] md:left-[34%] top-[calc(73%+0.5rem)] md:top-[calc(84%+0.6rem)] label text-ink">
        Courtyard residence, Wayanad
      </p>
      <div data-hero-post className="invisible absolute z-10 inset-x-0 bottom-5 md:bottom-8 page-x flex items-baseline justify-between gap-6">
        <p className="label">Selected work. Design visualisations.</p>
        <a href="#/projects" className="text-link text-[15px]">All projects</a>
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

      {/* The emblem, centre stage until it docks in the navbar */}
      <div data-hero-emblem-wrap className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span data-hero-emblem className="block text-ink will-change-transform">
          <MovingEmblem className="size-[min(38svh,64vw)]" />
        </span>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */

const STACK_SIZE = 19;
// Pinned only where the four steps and their axis fit on one screen; the footer curtain uses the same bound
const PROCESS_PIN = '(min-width: 1024px) and (min-height: 800px)';

/**
 * The house assembles: on large screens the steps pin, and as you scroll each one lights in turn,
 * drops its new box onto the stack and draws its bar along the timeline. Elsewhere each row
 * plays once as it arrives. Everything renders finished until the script takes over.
 */
const ProcessSequence: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('[data-step]', root);
      const bars = rows.map((r) => r.querySelector<HTMLElement>('[data-step-bar]')!);
      gsap.set(bars, { transformOrigin: 'left center' });

      const mm = gsap.matchMedia();
      mm.add(PROCESS_PIN, () => {
        // Scrubbed boxes can't share the CSS drop transition, so the stacks hand it to the timeline
        root.classList.add('process--driven');
        const cubes = rows.map((r) => r.querySelector<HTMLElement>('.box-stack__slot--new .cube')!);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'center center',
            end: '+=140%',
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });
        rows.forEach((row, i) => {
          tl.fromTo(row.querySelectorAll('[data-step-part]'), { opacity: 0.2 }, { opacity: 1, duration: 0.35 }, i)
            .fromTo(cubes[i], { y: -STACK_SIZE * 2.2, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, i + 0.05)
            .fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power1.inOut' }, i + 0.2);
        });
        tl.to({}, { duration: 0.4 }); // a beat with the house standing before the pin lets go
        return () => root.classList.remove('process--driven');
      });

      mm.add(`not all and ${PROCESS_PIN}`, () => {
        rows.forEach((row, i) => {
          gsap.fromTo(bars[i], { scaleX: 0 }, {
            scaleX: 1, duration: 1.2, ease: 'expo.out', delay: 0.25,
            scrollTrigger: { trigger: row, start: 'top 86%', once: true },
          });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <ol>
        {PROCESS.map((step, i) => (
          <li key={step.title} data-step className="grid-page gap-y-3 items-center rule py-5 md:py-6">
            {/* One more box per step: the house stands by the last one */}
            <div data-step-part className="col-span-3 md:col-span-1">
              <BoxStack count={i + 1} size={STACK_SIZE} />
            </div>
            <div data-step-part className="col-span-9 md:col-span-3">
              <h3 className="text-[20px] md:text-[22px] tracking-tight">{step.title}</h3>
              <p className="label mt-1">Step {i + 1}, {step.duration}</p>
            </div>
            <p data-step-part className="col-span-12 md:col-span-4 text-[15px] leading-relaxed text-ink-muted max-w-[46ch]">{step.body}</p>
            <div className="col-span-12 md:col-span-4 relative h-2 mt-2 md:mt-0" aria-hidden="true">
              {/* Two track segments with a gap at the scale change */}
              <div className="absolute inset-y-[3px] left-0 right-[calc(50%+3px)] bg-stone-1" />
              <div className="absolute inset-y-[3px] left-[calc(50%+3px)] right-0 bg-stone-1" />
              <div
                data-step-bar
                className="absolute inset-y-0 bg-ink"
                style={{ left: `${processX(step.start)}%`, width: `${processX(step.end) - processX(step.start)}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
      <div className="grid-page" aria-hidden="true">
        <div className="col-span-12 md:col-start-9 md:col-span-4 relative h-7 label rule">
          <span className="absolute left-0 top-2">Start</span>
          <span className="absolute left-1/2 top-2 -translate-x-1/2">Month 3</span>
          <span className="absolute right-0 top-2">Month 14</span>
        </div>
        <p className="col-span-12 md:col-start-9 md:col-span-4 label mt-2">
          The first three months are drawn at a larger scale.
        </p>
      </div>
    </div>
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
      <section className={SECTION} aria-labelledby="studio-heading">
        <div className="grid-page gap-y-8">
          <SectionLabel id="studio-heading" className="col-span-12 md:col-span-2 pt-2">The studio</SectionLabel>
          <div className="col-span-12 md:col-span-10 lg:col-span-9">
            <WordFill className="prose-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.12]">
              We draw every building as boxes and lines: a box for each part of life, and flowing lines of movement, light and air weaving through them all.
            </WordFill>
            <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              Flowspace Architects is an architecture and design studio led by Chief Architect Ar. Rashid Ali, working across architecture, interiors, landscape, master planning and research from Wayanad and Bengaluru. Each project is designed around nature, the way people come together, and their well-being.
            </p>
            <a href="#/studio" className="text-link mt-8 text-[15px]">About the studio</a>
          </div>
        </div>

        <dl className="grid-page gap-y-0 mt-12 md:mt-16 text-[15px]">
          {[
            ['Studios', 'Kalpetta, Wayanad and Jayanagar, Bengaluru'],
            ['Services', 'Architecture, interior design, landscape design, master planning and product design'],
            ['Project types', 'Homes from budget to weekend retreats, apartments, resorts and eco villages, cafés, breweries and club houses, retail, interiors and furniture'],
            ['Honours', 'Design & Vision Firm of the Year 2026, South India; Vanitha Veedu Young Architect Award; FOAID Design Week'],
          ].map(([term, desc]) => (
            <div key={term} className="col-span-12 md:col-start-3 md:col-span-10 grid grid-cols-[8.5rem_1fr] sm:grid-cols-[11rem_1fr] gap-4 rule py-4">
              <dt className="text-ink-muted">{term}</dt>
              <dd>
                {term === 'Honours' ? <a href="#/press" className="hover:text-accent transition-colors">{desc}</a> : desc}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Selected work */}
      <section className="pt-16 md:pt-24" aria-labelledby="work-heading">
        <div className="page-x grid-page items-center mb-8 md:mb-10">
          <SectionLabel id="work-heading" className="col-span-6 md:col-span-3">Selected work</SectionLabel>
          <a href="#/projects" className="col-span-6 md:col-span-9 justify-self-end text-link text-[15px] whitespace-nowrap">All projects ({PROJECTS_DATA.length})</a>
        </div>

        {/* Full-screen reel: each project's photo blurred behind a portrait card, the next wiping up as you scroll */}
        <ProjectReel projects={PROJECTS_DATA.slice(0, 4)} />
      </section>

      {/* Sun study: a model to turn, under the real sun for Wayanad */}
      <section className={SECTION} aria-labelledby="sun-heading">
        <div className="grid-page gap-y-8">
          <SectionLabel id="sun-heading" className="col-span-12 md:col-span-2 pt-2">Sun study</SectionLabel>
          <div className="col-span-12 md:col-span-10">
            <WordFill className="prose-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.12] max-w-[22ch]">
              Deep eaves and a courtyard, through a day of sun.
            </WordFill>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              A courtyard house at Wayanad’s latitude. Move the time and the season to see where the shade falls.
            </p>
            <div ref={sunRef} className="mt-8 md:mt-10">
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
      <section className={SECTION} aria-labelledby="process-heading">
        <div className="grid-page gap-y-8 mb-8 md:mb-12">
          <SectionLabel id="process-heading" className="col-span-12 md:col-span-2 pt-2">Process</SectionLabel>
          <div className="col-span-12 md:col-span-10 lg:col-span-9">
            <WordFill className="prose-serif text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.12]">From idea to built form.</WordFill>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              A typical house takes about fourteen months from first site visit to handover. Most of that is building.
            </p>
          </div>
        </div>

        <ProcessSequence />
      </section>

      {/* Client words and where we work share one band */}
      <div className="bg-plaster page-x py-16 md:py-24 mt-16 md:mt-24">
        <div className="grid-page gap-y-16">
        <section className="col-span-12 md:col-span-7" aria-labelledby="clients-heading">
          <SectionLabel id="clients-heading" className="mb-6 md:mb-8">Client words</SectionLabel>
          <figure aria-live="polite">
            <blockquote key={current} className="prose-serif text-[26px] sm:text-[32px] lg:text-[38px] leading-[1.18] animate-in">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-end justify-between gap-6 rule pt-5">
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
        </section>

        <section className="col-span-12 md:col-start-9 md:col-span-4" aria-labelledby="areas-heading">
          <SectionLabel id="areas-heading" className="mb-6 md:mb-8">Where we work</SectionLabel>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1">
            {([['Wayanad studio, Kalpetta', PLACES.wayanad], ['Bengaluru studio, Jayanagar', PLACES.bengaluru]] as const).map(([title, places]) => (
              <div key={title}>
                <h3 className="text-[15px] text-ink-muted mb-2">{title}</h3>
                <p className="text-[19px] sm:text-[21px] leading-[1.35] tracking-tight font-light">{places.join(', ')}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-ink-muted max-w-[40ch]">
            Building somewhere else in Kerala or Karnataka? Ask us. We travel for the right project.
          </p>
        </section>
        </div>
      </div>

      {/* Research and Journal side by side, both as lists */}
      <div className={SECTION}>
        <div className="grid-page gap-y-16">
          <section className="col-span-12 md:col-span-6" aria-labelledby="research-heading">
            <div className="flex items-center justify-between gap-6 mb-6 md:mb-8">
              <SectionLabel id="research-heading">Research</SectionLabel>
              <a href="#/research" className="text-link text-[15px]">All research</a>
            </div>
            <ul className="border-b border-line">
              {RESEARCH_DATA.slice(0, 3).map((r) => (
                <li key={r.id} className="rule">
                  <a href={`#/research/${r.id}`} className="group grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8.5rem_1fr] gap-5 py-5 items-center">
                    <div className="aspect-[4/3] overflow-hidden bg-line">
                      <img src={r.image} srcSet={srcSet(r.image)} sizes="9rem" alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
                    </div>
                    <div>
                      <p className="label">{r.type}, {r.year}</p>
                      <h3 className="mt-1 text-[18px] sm:text-[20px] leading-[1.25] tracking-tight transition-colors group-hover:text-accent">{r.title}</h3>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="col-span-12 md:col-span-6" aria-labelledby="journal-heading">
            <div className="flex items-center justify-between gap-6 mb-6 md:mb-8">
              <SectionLabel id="journal-heading">Journal</SectionLabel>
              <a href="#/journal" className="text-link text-[15px]">All articles</a>
            </div>
            <ul className="border-b border-line">
              {JOURNAL.map((item) => (
                <li key={item.title} className="rule">
                  <a href={item.href} className="group block py-5">
                    <span className="label block">{item.date}</span>
                    <span className="mt-1 block text-[20px] sm:text-[24px] leading-[1.22] tracking-tight transition-colors group-hover:text-accent">
                      {item.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Questions */}
      <section className={`${SECTION} pb-24 md:pb-32`} aria-labelledby="faq-heading">
        <div className="grid-page gap-y-8">
          <div className="col-span-12 md:col-span-3">
            <SectionLabel id="faq-heading" className="pt-2">Questions</SectionLabel>
            <p className="mt-6 text-[15px] text-ink-muted max-w-[30ch] leading-relaxed">
              Happy to talk on a call, or welcome you to our studios in Kalpetta or Jayanagar.
            </p>
            <RouteLink to="contact" onNavigate={onNavigate} className="text-link mt-4 text-[15px]">Get in touch</RouteLink>
          </div>
          <div className="col-span-12 md:col-span-9 border-b border-line">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="rule">
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
