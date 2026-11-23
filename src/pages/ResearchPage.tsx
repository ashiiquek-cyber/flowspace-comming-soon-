import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { srcSet } from '../constants/assets';
import { LineRise, WordFill } from '../components/TextMotion';
import { BoxMarker } from '../components/Massing';
import { RESEARCH_DATA, type ResearchType } from '../data/research';

const SunStudy = lazy(() => import('../components/SunStudy'));

const FILTERS: ('All' | ResearchType)[] = ['All', 'Study', 'Paper'];

export const ResearchPage: React.FC = () => {
  const [filter, setFilter] = useState<'All' | ResearchType>('All');
  const items = RESEARCH_DATA.filter((r) => filter === 'All' || r.type === filter);

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
    <div className="page-x pt-16 md:pt-24 pb-28 md:pb-44">
      <div className="grid-page gap-y-8 mb-14 md:mb-20">
        <LineRise className="col-span-12 md:col-span-8 display text-[16vw] md:text-[9vw]">Research</LineRise>
        <p className="col-span-12 md:col-span-4 md:self-end label max-w-[34ch] leading-relaxed">
          Papers and field studies from the studio, on climate, materials and the courtyard house.
        </p>
      </div>

      {/* Sun study: a model to turn, under the real sun for Wayanad */}
      <section className="grid-page gap-y-8 mb-20 md:mb-28" aria-labelledby="sun-heading">
        <h2 id="sun-heading" className="label flex items-center gap-2.5 self-start col-span-12 md:col-span-2 pt-2">
          <BoxMarker />
          Sun study
        </h2>
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
      </section>

      <div className="flex gap-6 mb-8" role="group" aria-label="Filter research by type">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`text-[15px] transition-colors ${filter === f ? 'text-ink underline underline-offset-4' : 'text-ink-muted hover:text-ink'}`}
          >
            {f === 'All' ? 'All' : `${f}s`}
          </button>
        ))}
      </div>

      <ul className="border-b border-line">
        {items.map((r) => (
          <li key={r.id} id={`research-${r.id}`} className="rule grid-page gap-y-5 py-8 md:py-12">
            <div className="col-span-12 md:col-span-3 flex md:flex-col gap-x-4 gap-y-1 label">
              <span>{r.type}</span>
              <span>{r.year}</span>
            </div>
            <div className="col-span-12 md:col-span-5">
              <h2 className="text-[24px] sm:text-[32px] leading-[1.15] tracking-tight">{r.title}</h2>
              <p className="mt-2 text-[13px] text-ink-muted">{r.venue}</p>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-muted max-w-[56ch]">{r.summary}</p>
              {r.findings && (
                <ul className="mt-5 space-y-1.5 text-[15px] leading-relaxed list-disc pl-5 marker:text-accent">
                  {r.findings.map((f) => <li key={f}>{f}</li>)}
                </ul>
              )}
              {r.href && <a href={r.href} className="text-link mt-6 inline-block text-[15px]">Read the full {r.type.toLowerCase()}</a>}
            </div>
            <div className="col-span-12 md:col-span-4 aspect-[4/3] overflow-hidden bg-line">
              <img src={r.image} srcSet={srcSet(r.image)} sizes="(max-width: 767px) 100vw, 33vw" alt="" loading="lazy" decoding="async" className="size-full object-cover" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
