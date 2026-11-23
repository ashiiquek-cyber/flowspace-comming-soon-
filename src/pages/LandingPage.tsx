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
import { createHeroModelState, type HeroModelState } from '../components/heroModelState';

const SunStudy = lazy(() => import('../components/SunStudy'));
const HeroTower = lazy(() => import('../components/HeroTower'));

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

// The gallery the hero settles into: the tower as a tall centre card, four projects clustered round it.
// Phones keep the first two, so the cluster never crowds the centre
const HERO_GALLERY = PROJECTS_DATA.slice(0, 4);
// A tight cluster running from top left to bottom right. The photos overlap one another, and the two
// nearest the centre tuck in under the tower's card. Below xl the card takes more of the width, so the
// cluster spreads out a little to keep the photos clear of it
const HERO_CARD_LAYOUT = [
  'left-[4%] top-[13%] w-[44%] aspect-[4/3] md:left-[3%] md:top-[26%] md:w-[26%] md:aspect-[8/5] xl:left-[7.5%] xl:top-[27%] xl:w-[20.5%]',
  'left-[52%] top-[62%] w-[44%] aspect-[4/3] md:left-[19%] md:top-[12%] md:w-[19%] md:aspect-[8/5] xl:left-[25%] xl:top-[11.5%] xl:w-[16%]',
  'max-md:hidden left-[62%] top-[43%] w-[19%] aspect-[8/5] xl:left-[58.5%] xl:top-[41%] xl:w-[15%]',
  'max-md:hidden left-[70%] top-[57%] w-[27%] aspect-[8/5] xl:left-[71.5%] xl:top-[56%] xl:w-[20.5%]',
];
/** The tower's card at the end of step 4, in px within the hero: tall, and a little above centre */
const heroCard = (W: number, H: number, desktop: boolean) => {
  if (desktop) {
    const h = H * 0.54, w = Math.min(h * 0.77, W * 0.3);
    return { left: (W - w) / 2, top: H * 0.14, w, h };
  }
  const w = W * 0.52, h = Math.min(H * 0.44, w * 1.75);
  return { left: (W - w) / 2, top: H * 0.24, w, h };
};
const INTRO = 'Architecture, interiors and landscape from Kalpetta, Wayanad and Jayanagar, Bengaluru. Led by Chief Architect Ar. Rashid Ali.';
const STUDIO_STATEMENT = 'We draw every building as boxes and lines: a box for each part of life, and flowing lines of movement, light and air weaving through them all.';

/**
 * Text that the hero's timeline writes in word by word. Screen readers get the sentence whole from
 * a hidden copy; the visible words are inline blocks the timeline can blur, lift and fade.
 * `breakAfter` ends a line there on wide screens.
 */
const HeroWords: React.FC<{ text: string; group: string; breakAfter?: number }> = ({ text, group, breakAfter }) => {
  const words = text.split(' ');
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span data-words={group} className="inline-block">{w}</span>
            {breakAfter === i ? <br className="max-md:hidden" /> : i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </span>
    </>
  );
};

/* -------------------------------------------------------------------------- */

const Hero: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  // Under reduced motion the tower is drawn once, standing, stair built
  const model = useRef<HeroModelState>(reduced ? { assemble: 1, stair: 1, rise: 0.3 } : createHeroModelState());
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);

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

      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (c) => {
        const { desktop } = c.conditions as { desktop: boolean };
        gsap.set('[data-hero-aperture]', { clipPath: 'inset(0px 0px 0px 0px)' });
        if (navEmblem && navWordmark) gsap.set([navEmblem, navWordmark], { autoAlpha: 0 });

        // The dock is played, not scrubbed: the first nudge of the wheel flies the emblem into the bar
        const DOCKED_AT = 0.9;
        const dockTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } });
        dockTl.fromTo('[data-hero-emblem]', { x: 0, y: 0, scale: 1 }, { x: () => dock().x, y: () => dock().y, scale: () => dock().scale, duration: DOCKED_AT }, 0);
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

        // Four scroll steps, in timeline units: 0–1 the tower gathers; 1.1–2.1 the headline is written
        // and the stair climbs; 2.2–3.8 the studio statement is written as the view rises;
        // 4–5 the tower shrinks into a card and the projects fly in round it
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=420%',
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

        const state = model.current;
        const wordIn = { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.35 };
        const wordFrom = { autoAlpha: 0, yPercent: 45, filter: 'blur(10px)' };

        // 1. The intro line clears and the scattered boxes gather into the tower
        tl.fromTo('[data-hero-fade]', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -16, ease: 'power1.in', duration: 0.35 }, 0)
          .fromTo(state, { assemble: 0 }, { assemble: 1, ease: 'none', duration: 1 }, 0);

        // 2. The tower steps back a little and the headline is written over it as the stair climbs
        tl.fromTo('[data-hero-stage]', { opacity: 1 }, { opacity: 0.62, ease: 'power1.inOut', duration: 0.3 }, 1.0)
          .fromTo('[data-words="head"]', wordFrom, { ...wordIn, stagger: 0.08 }, 1.1)
          .fromTo(state, { stair: 0 }, { stair: 1, ease: 'none', duration: 0.95 }, 1.1);

        // 3. The headline lifts away; the studio statement is written as the view rises
        tl.fromTo('[data-words="head"]', { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)' }, { autoAlpha: 0, yPercent: -35, filter: 'blur(8px)', ease: 'power1.in', duration: 0.25, stagger: 0.02, immediateRender: false }, 2.2)
          .fromTo('[data-hero-studio-label]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 2.45)
          .fromTo('[data-words="studio"]', wordFrom, { ...wordIn, stagger: 0.035 }, 2.55)
          .fromTo(state, { rise: 0 }, { rise: 1, ease: 'power1.inOut', duration: 1.5 }, 2.2);

        // 4. The statement clears, the full-screen tower closes in to a tall card, and the projects fly
        // in from the edges to cluster round it
        const card = () => heroCard(root.clientWidth, root.clientHeight, desktop);
        const cardClip = () => {
          const W = root.clientWidth, H = root.clientHeight, c = card();
          return `inset(${c.top}px ${W - c.left - c.w}px ${H - c.top - c.h}px ${c.left}px)`;
        };

        // Each project flies in from the edge of the screen nearest to where it lands
        const away = (el: HTMLElement) => {
          const W = root.clientWidth, H = root.clientHeight;
          const { offsetLeft: l, offsetTop: t, offsetWidth: w, offsetHeight: h } = el;
          const gaps = [l, W - l - w, t, H - t - h];
          const side = gaps.indexOf(Math.min(...gaps));
          const far = 1.15;
          return side === 0 ? { x: -(l + w) * far, y: 0 }
            : side === 1 ? { x: (W - l) * far, y: 0 }
            : side === 2 ? { x: 0, y: -(t + h) * far }
            : { x: 0, y: (H - t) * far };
        };

        const S4 = 4.0;
        tl.fromTo('[data-hero-studio]', { opacity: 1, y: 0 }, { opacity: 0, y: -30, ease: 'power1.in', duration: 0.3, immediateRender: false }, S4)
          .fromTo(
            '[data-hero-aperture]',
            { clipPath: 'inset(0px 0px 0px 0px)', backgroundColor: '#ecebe5' },
            { clipPath: cardClip, backgroundColor: '#e3e2db', ease: 'power2.inOut', duration: 0.7 },
            S4,
          )
          // The tower shrinks with its card, keeping to the card's centre
          .to('[data-hero-stage]', {
            opacity: 1,
            y: () => { const c = card(); return c.top + c.h / 2 - root.clientHeight / 2; },
            scale: desktop ? 0.62 : 0.5,
            ease: 'power2.inOut',
            duration: 0.7,
          }, S4)
          .fromTo('[data-hero-card]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: 0.07 }, S4 + 0.15)
          .fromTo(
            '[data-hero-card]',
            { x: (_i: number, el: HTMLElement) => away(el).x, y: (_i: number, el: HTMLElement) => away(el).y },
            { x: 0, y: 0, ease: 'power3.out', stagger: 0.07, duration: 0.65 },
            S4 + 0.15,
          )
          .fromTo('[data-hero-post]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, S4 + 0.7);

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

  const tower = (still: boolean) =>
    modelFailed ? (
      <img
        src={ASSETS.heroBg}
        srcSet={srcSet(ASSETS.heroBg)}
        sizes="100vw"
        alt="Double-height living room opening onto a garden courtyard"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    ) : (
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${modelReady || still ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={null}>
          <HeroTower state={model} still={still} onReady={() => setModelReady(true)} onFail={() => setModelFailed(true)} />
        </Suspense>
      </div>
    );

  if (reduced) {
    return (
      <section className="pt-[120px] md:pt-[140px]">
        <div className="page-x grid-page gap-y-8 pb-10">
          <p className="col-span-12 md:col-span-4 label max-w-[30ch]">{INTRO}</p>
          <h1 className="col-span-12 display text-[13vw] md:text-[7vw]">
            {HEADLINE.map((l) => <span key={l} className="block">{l}</span>)}
          </h1>
        </div>
        <div className="relative h-[80svh] bg-stone-1">{tower(true)}</div>
        <div className="page-x pt-16 md:pt-24 text-center">
          <h2 className="label">The studio</h2>
          <p className="prose-serif mx-auto mt-6 max-w-[26ch] text-[28px] sm:text-[36px] lg:text-[46px] leading-[1.12]">{STUDIO_STATEMENT}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative h-[100svh] overflow-hidden bg-lime" aria-label="Introduction">
      {/* Aperture: the tower, full screen behind the text, then closed in to the gallery's tall centre
          card. It sits over the projects nearest it */}
      <div data-hero-aperture className="absolute z-[6] inset-0 bg-lime will-change-[clip-path]">
        <div data-hero-frame className="absolute inset-0 overflow-hidden">
          <div data-hero-stage className="absolute inset-0 will-change-transform">{tower(false)}</div>
        </div>
      </div>

      {/* Gallery: the projects, flown in from the edges to cluster round the tower */}
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
              sizes="(max-width: 767px) 44vw, 21vw"
              alt=""
              decoding="async"
              style={{ objectPosition: p.focus }}
              className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
          </span>
        </a>
      ))}
      <div data-hero-post className="invisible absolute z-10 inset-x-0 bottom-5 md:bottom-8 page-x flex items-baseline justify-between gap-6">
        <p className="label">Selected work. Design visualisations.</p>
        <a href="#/projects" className="text-link text-[15px]">All projects</a>
      </div>

      {/* 1. The intro line, bottom left until the first scroll */}
      <div className="absolute z-10 inset-x-0 bottom-0 page-x pb-6 md:pb-8 pointer-events-none">
        <p data-hero-fade className="label max-w-[30ch] md:max-w-[34ch] text-ink">{INTRO}</p>
      </div>

      {/* 2. The headline, centred over the tower */}
      <div className="absolute z-10 inset-0 page-x flex items-center justify-center pointer-events-none">
        <h1 className="display text-center text-balance text-[13vw] md:text-[7vw]">
          <HeroWords text={HEADLINE.join(' ')} group="head" breakAfter={2} />
        </h1>
      </div>

      {/* 3. The studio statement, centred over the tower */}
      <div data-hero-studio className="absolute z-10 inset-0 page-x flex flex-col items-center justify-center text-center pointer-events-none">
        <h2 data-hero-studio-label className="opacity-0 label">The studio</h2>
        <p className="prose-serif mt-6 max-w-[24ch] text-[30px] sm:text-[38px] lg:text-[3.3vw] leading-[1.14]">
          <HeroWords text={STUDIO_STATEMENT} group="studio" />
        </p>
      </div>

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

const STUDIO_FACTS = [
  ['Studios', 'Kalpetta, Wayanad and Jayanagar, Bengaluru'],
  ['Services', 'Architecture, interior design, landscape design, master planning and product design'],
  ['Project types', 'Homes from budget to weekend retreats, apartments, resorts and eco villages, cafés, breweries and club houses, retail, interiors and furniture'],
  ['Honours', 'Design & Vision Firm of the Year 2026, South India; Vanitha Veedu Young Architect Award; FOAID Design Week'],
];

/**
 * The studio's facts as a table whose rows are written in as they arrive: each term rises first and
 * its answer follows a beat later, under the row's hairline as that draws. They render finished until
 * the script takes over, and stay so under reduced motion.
 */
const StudioFacts: React.FC = () => {
  const rootRef = useRef<HTMLDListElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-fact]', root).forEach((row) => {
        const [term, desc] = Array.from(row.children);
        const trigger = { trigger: row, start: 'top 90%', once: true };
        gsap.fromTo(term, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger });
        gsap.fromTo(desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.12, scrollTrigger: trigger });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <dl ref={rootRef} className="grid-page gap-y-0 mt-12 md:mt-16 text-[15px]">
      {STUDIO_FACTS.map(([term, desc]) => (
        <div key={term} data-fact className="col-span-12 md:col-start-3 md:col-span-10 grid grid-cols-[8.5rem_1fr] sm:grid-cols-[11rem_1fr] gap-4 rule py-4">
          <dt className="text-ink-muted">{term}</dt>
          <dd>
            {term === 'Honours' ? <a href="#/press" className="hover:text-accent transition-colors">{desc}</a> : desc}
          </dd>
        </div>
      ))}
    </dl>
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

      {/* Studio: its label and statement are written over the tower in the hero; the detail follows here */}
      <section className={SECTION} aria-label="About the studio">
        <div className="grid-page gap-y-8">
          <div className="col-span-12 md:col-start-3 md:col-span-10 lg:col-span-9">
            <WordFill className="max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              Flowspace Architects is an architecture and design studio led by Chief Architect Ar. Rashid Ali, working across architecture, interiors, landscape, master planning and research from Wayanad and Bengaluru. Each project is designed around nature, the way people come together, and their well-being.
            </WordFill>
            <a href="#/studio" className="text-link mt-8 text-[15px]">About the studio</a>
          </div>
        </div>

        <StudioFacts />
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
