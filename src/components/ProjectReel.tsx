import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { srcSet } from '../constants/assets';
import { prefersReducedMotion } from '../context/SmoothScrollContext';
import type { ProjectItem } from '../data/projects';

// The blurred room around the card needs no detail, so it takes the smallest file
const small = (src: string) => src.replace(/-1600\.webp$/, '-640.webp');

/**
 * Full-screen project panels pinned under one another. Each project fills the screen with
 * its photo softly blurred behind a portrait card; scrolling wipes the next panel up from
 * the bottom edge while the outgoing card drifts up and away.
 */
export const ProjectReel: React.FC<{ projects: ProjectItem[] }> = ({ projects }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [animated] = useState(() => !prefersReducedMotion());

  useLayoutEffect(() => {
    if (!animated || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]');
      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      });
      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, i - 1)
          .to(panels[i - 1].querySelector('[data-stack]'), { yPercent: -22 }, i - 1);
      });
    }, rootRef);
    return () => ctx.revert();
  }, [animated, projects]);

  return (
    <div ref={rootRef} className="relative" style={animated ? { height: `${projects.length * 100}svh` } : undefined}>
      <div className={animated ? 'sticky top-0 h-[100svh] overflow-hidden' : ''}>
        {projects.map((project, i) => (
          <article
            key={project.id}
            data-panel
            className={`${animated ? 'absolute inset-0' : 'relative h-[100svh]'} overflow-hidden bg-kadappa`}
            style={{ zIndex: i + 1 }}
          >
            {/* The same photograph, out of focus, as the room around the card */}
            <img
              src={small(project.image)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover scale-110 blur-[8px] md:blur-[12px]"
              style={project.focus ? { objectPosition: project.focus } : undefined}
            />
            <div className="absolute inset-0 bg-black/25" />

            <div data-stack className="absolute inset-0 grid place-items-center">
              <a href={`#/project/${project.id}`} className="group relative grid place-items-center">
                <div className="w-[clamp(190px,16vw,320px)] aspect-[5/7] overflow-hidden">
                  <img
                    src={project.image}
                    srcSet={srcSet(project.image)}
                    sizes="(max-width: 767px) 60vw, 20vw"
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.05]"
                    style={project.focus ? { objectPosition: project.focus } : undefined}
                  />
                </div>

                <div className="absolute inset-x-0 top-1/2 -translate-y-[62%] flex flex-col items-center text-center text-white pointer-events-none">
                  <p className="whitespace-nowrap text-[11px] md:text-[13px] uppercase tracking-wide text-white/85">{project.category} &middot; {project.location}</p>
                  <h3 className="mt-2 md:mt-3 w-max max-w-[92vw] text-balance uppercase font-normal tracking-tight leading-[0.95] text-[clamp(34px,4.2vw,80px)] [text-shadow:0_2px_24px_rgba(0,0,0,0.25)]">
                    {project.title}
                  </h3>
                  <span className="mt-4 md:mt-5 inline-flex items-center gap-2 text-[14px] md:text-[15px] font-medium">
                    View
                    <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 transition-transform duration-500 ease-out-expo -rotate-45 group-hover:rotate-0">
                      <path d="M1 6h9M6.5 2.5 10 6 6.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
