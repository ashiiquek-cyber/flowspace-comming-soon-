import React, { useEffect, useRef, useState } from 'react';
import { Aperture } from '../components/Aperture';
import { prefersReducedMotion, useSmoothScroll } from '../context/SmoothScrollContext';
import { PROJECTS_DATA, type NavigateTarget, type ProjectItem } from '../data/projects';

// Re-exported for modules that imported project data from this page before it moved
export { PROJECTS_DATA };
export type { ProjectItem };

interface ProjectsPageProps {
  onNavigate: (target: NavigateTarget) => void;
  onOpenProject: (id: string) => void;
}

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Apartments', 'Interiors', 'Furniture'] as const;

// Alternating placements on the 12-column grid so the archive reads as a sequence of spreads
const PLACEMENTS = [
  'md:col-span-7 aspect-[4/3]',
  'md:col-start-9 md:col-span-4 aspect-[3/4] md:mt-40',
  'md:col-start-2 md:col-span-5 aspect-[4/5]',
  'md:col-start-8 md:col-span-5 aspect-[4/3] md:mt-56',
  'md:col-span-8 aspect-[16/10]',
  'md:col-start-10 md:col-span-3 aspect-[3/4] md:mt-24',
];

export const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const [activeFilter, setActiveFilter] = useState<(typeof CATEGORIES)[number]>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'index'>('grid');
  const barRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();

  // Changing what is listed changes page height; bring the list back under the bar
  const keepListInView = () => {
    const bar = barRef.current;
    if (!bar) return;
    const stuckAt = parseFloat(getComputedStyle(bar).top) || 0;
    if (bar.getBoundingClientRect().top <= stuckAt + 1) {
      const sentinel = bar.previousElementSibling as HTMLElement | null;
      if (sentinel) scrollTo(sentinel.offsetTop + sentinel.offsetHeight - stuckAt, { immediate: true });
    }
  };

  const filtered = activeFilter === 'All' ? PROJECTS_DATA : PROJECTS_DATA.filter((p) => p.category === activeFilter);
  const counts = (cat: string) => (cat === 'All' ? PROJECTS_DATA.length : PROJECTS_DATA.filter((p) => p.category === cat).length);

  return (
    <div className="flex flex-col">
      <section className="page-x pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="grid-page gap-y-8 items-end">
          <h1 className="col-span-12 lg:col-span-8 display text-[22vw] md:text-[14vw] lg:text-[12vw]">Projects</h1>
          <p className="col-span-12 lg:col-span-4 text-[19px] sm:text-[22px] leading-[1.35] tracking-tight max-w-[30ch] lg:pb-4">
            Homes, apartments, commercial spaces, interiors and furniture, designed in Kerala and Karnataka.
          </p>
        </div>
      </section>

      {/* Filters and view */}
      <div ref={barRef} className="sticky top-[var(--header-offset)] z-30 bg-lime border-y border-line transition-[top] duration-500 ease-out-expo">
        <div className="page-x py-3.5 flex items-center justify-between gap-6">
          <div role="group" aria-label="Filter by type" className="flex items-center gap-5 sm:gap-7 overflow-x-auto scrollbar-none text-[15px] -mx-1 px-1">
            {CATEGORIES.map((cat) => {
              const n = counts(cat);
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveFilter(cat); keepListInView(); }}
                  aria-pressed={active}
                  disabled={n === 0}
                  className={`whitespace-nowrap transition-colors disabled:text-stone-2 disabled:cursor-not-allowed ${active ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                >
                  <span className={active ? 'border-b border-ink pb-0.5' : ''}>{cat}</span>
                  <sup className="ml-0.5 text-[10px] tabular-nums">{n}</sup>
                </button>
              );
            })}
          </div>
          <div role="group" aria-label="View" className="flex items-center gap-4 text-[15px] shrink-0">
            {(['grid', 'index'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); keepListInView(); }}
                aria-pressed={viewMode === mode}
                className={`capitalize transition-colors ${viewMode === mode ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="page-x pt-14 md:pt-20 pb-32 md:pb-48">
        {viewMode === 'grid' ? (
          <ul key={activeFilter} className="grid-page gap-y-16 md:gap-y-28 items-start">
            {filtered.map((project, i) => (
              <li key={project.id} className={`col-span-12 ${PLACEMENTS[i % PLACEMENTS.length].replace(/aspect-\S+/, '')}`}>
                <a href={`#/project/${project.id}`} className="group block">
                  <Aperture
                    src={project.image}
                    alt={project.title}
                    focus={project.focus}
                    className={PLACEMENTS[i % PLACEMENTS.length].match(/aspect-\S+/)?.[0]}
                    imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
                  />
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h2 className="text-[22px] md:text-[24px] tracking-tight group-hover:text-accent transition-colors">{project.title}</h2>
                    <span className="label tabular-nums">{project.year}</span>
                  </div>
                  <p className="label">{project.location}, {project.discipline.toLowerCase()}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ProjectIndex projects={filtered} />
        )}
      </section>
    </div>
  );
};

/** Table view with a thumbnail that trails the pointer on devices that hover. */
const ProjectIndex: React.FC<{ projects: ProjectItem[] }> = ({ projects }) => {
  const [hovered, setHovered] = useState<ProjectItem | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;
    const reduced = prefersReducedMotion();
    const onMove = (e: PointerEvent) => { target.current = { x: e.clientX, y: e.clientY }; };
    let raf = 0;
    const loop = () => {
      const k = reduced ? 1 : 0.14;
      pos.current.x += (target.current.x - pos.current.x) * k;
      pos.current.y += (target.current.y - pos.current.y) * k;
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${pos.current.x + 40}px, ${pos.current.y - 220}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div onPointerLeave={() => setHovered(null)}>
      <table className="w-full text-left border-collapse text-[15px]">
        <thead>
          <tr className="text-ink-muted border-b border-ink">
            <th scope="col" className="font-normal py-3 pr-4">Project</th>
            <th scope="col" className="font-normal py-3 pr-4 hidden md:table-cell">Location</th>
            <th scope="col" className="font-normal py-3 pr-4 hidden lg:table-cell">Type</th>
            <th scope="col" className="font-normal py-3 pr-4 hidden lg:table-cell">Discipline</th>
            <th scope="col" className="font-normal py-3 pr-4 hidden sm:table-cell">Area</th>
            <th scope="col" className="font-normal py-3 text-right">Year</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr
              key={p.id}
              onPointerEnter={() => setHovered(p)}
              className="group border-b border-line relative"
            >
              <td className="py-5 pr-4">
                <a href={`#/project/${p.id}`} className="text-[20px] md:text-[24px] tracking-tight group-hover:text-accent transition-colors after:absolute after:inset-0">
                  {p.title}
                </a>
                <span className="block md:hidden label">{p.location}</span>
              </td>
              <td className="py-5 pr-4 text-ink-muted hidden md:table-cell">{p.location}</td>
              <td className="py-5 pr-4 text-ink-muted hidden lg:table-cell">{p.category}</td>
              <td className="py-5 pr-4 text-ink-muted hidden lg:table-cell">{p.discipline}</td>
              <td className="py-5 pr-4 text-ink-muted hidden sm:table-cell tabular-nums">{p.area}</td>
              <td className="py-5 text-right text-ink-muted tabular-nums">{p.year}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-40 w-[260px] aspect-[4/3] overflow-hidden bg-stone-1 transition-[opacity,clip-path] duration-500 ease-out-expo hidden [@media(hover:hover)]:block ${
          hovered ? 'opacity-100 [clip-path:inset(0)]' : 'opacity-0 [clip-path:inset(100%_0_0_0)]'
        }`}
      >
        {hovered && <img src={hovered.image} alt="" className="size-full object-cover" style={hovered.focus ? { objectPosition: hovered.focus } : undefined} />}
      </div>
    </div>
  );
};
