import React, { useState } from 'react';
import { Aperture } from '../components/Aperture';
import { getNextProject, getProject, type NavigateTarget } from '../data/projects';

interface ProjectDetailPageProps {
  onNavigate: (target: NavigateTarget) => void;
  onOpenProject: (id: string) => void;
  projectId?: string;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ onNavigate, projectId }) => {
  const project = getProject(projectId);
  const next = getNextProject(project.id);

  const specs: [string, string][] = [
    ['Location', project.location],
    ['Year', project.year],
    ['Client', project.client ?? 'Private client'],
    ['Area', project.area],
    ['Status', project.status],
    ['Scope', project.discipline],
  ];

  return (
    <article className="flex flex-col">
      <header className="page-x pt-12 md:pt-20 pb-12 md:pb-16">
        <a href="#/projects" className="label hover:text-ink transition-colors">Projects, {project.category.toLowerCase()}</a>
        <h1 className="display text-[15vw] md:text-[10vw] lg:text-[8.6vw] mt-6 md:mt-8 max-w-[14ch]">{project.title}</h1>
        <div className="grid-page gap-y-10 mt-10 md:mt-16">
          <p className="col-span-12 md:col-span-6 prose-serif text-[24px] sm:text-[30px] leading-[1.18] max-w-[30ch]">
            {project.lead ?? project.description}
          </p>
          <dl className="col-span-12 md:col-start-8 md:col-span-5 grid grid-cols-2 gap-x-6 text-[15px]">
            {specs.map(([k, v]) => (
              <div key={k} className="border-t border-line py-3">
                <dt className="text-ink-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <figure className="pb-24 md:pb-36">
        <Aperture src={project.image} alt={`${project.title}, exterior`} focus={project.focus} eager className="w-full aspect-[4/3] md:aspect-[21/9]" />
        <figcaption className="page-x label mt-3">{project.title}, design visualisation and site integration</figcaption>
      </figure>

      {project.overview && (
        <section className="page-x pb-24 md:pb-36" aria-labelledby="overview-heading">
          <div className="grid-page gap-y-6">
            <h2 id="overview-heading" className="col-span-12 md:col-span-3 label pt-1.5">Overview</h2>
            <div className="col-span-12 md:col-span-8 lg:col-span-7 flex flex-col gap-6">
              {project.overview.map((p) => (
                <p key={p.slice(0, 24)} className="prose-serif text-[20px] md:text-[23px] leading-[1.5]">{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.challenge && project.solution && (
        <section className="page-x pb-24 md:pb-36">
          <div className="grid-page gap-y-12">
            {[['The challenge', project.challenge], ['Our response', project.solution]].map(([label, block], i) => {
              const b = block as { title: string; body: string };
              return (
                <div key={label as string} className={`col-span-12 md:col-span-5 border-t border-ink pt-5 ${i === 0 ? 'md:col-start-4' : 'md:col-start-9 md:col-span-4'}`}>
                  <h2 className="label">{label as string}</h2>
                  <h3 className="text-[22px] md:text-[26px] leading-tight tracking-tight mt-3">{b.title}</h3>
                  <p className="text-[16px] leading-relaxed text-ink-muted mt-4">{b.body}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {project.gallery && (
        <section className="page-x pb-24 md:pb-36">
          <div className="grid-page gap-y-12 items-start">
            {project.gallery.map((g, i) => (
              <figure key={g.caption} className={i === 0 ? 'col-span-12 md:col-span-7' : 'col-span-12 md:col-start-9 md:col-span-4 md:mt-48'}>
                <Aperture src={g.src} alt={g.caption} className={i === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'} />
                <figcaption className="label mt-3">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {project.comparison && <Comparison {...project.comparison} />}

      <section className="bg-plaster page-x py-24 md:py-36">
        <figure className="grid-page gap-y-6">
          <blockquote className="col-span-12 md:col-start-4 md:col-span-8 prose-serif text-[30px] sm:text-[44px] leading-[1.12]">
            “A space should speak for itself, without any description.”
          </blockquote>
          <figcaption className="col-span-12 md:col-start-4 md:col-span-8 label">Ar. Rashid Ali, Chief Architect</figcaption>
        </figure>
      </section>

      <section className="page-x py-24 md:py-36">
        <a href={`#/project/${next.id}`} className="group grid-page gap-y-6 items-end">
          <div className="col-span-12 md:col-span-8">
            <p className="label">Next project</p>
            <p className="display text-[13vw] md:text-[7.5vw] mt-3 group-hover:text-accent transition-colors">{next.title}</p>
            <p className="label mt-3">{next.location}, {next.year}</p>
          </div>
          <Aperture src={next.image} alt="" focus={next.focus} className="col-span-12 md:col-start-10 md:col-span-3 aspect-[4/5]" imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]" />
        </a>
        <div className="mt-16 flex flex-wrap gap-8 text-[15px]">
          <a href="#/projects" className="text-link">All projects</a>
          <button onClick={() => onNavigate('contact')} className="text-link">Discuss a similar project</button>
        </div>
      </section>
    </article>
  );
};

/** Design visualisation against built photograph, driven by a native range input for keyboard and touch. */
const Comparison: React.FC<{ design: string; built: string }> = ({ design, built }) => {
  const [pos, setPos] = useState(50);

  return (
    <section className="page-x pb-24 md:pb-36" aria-labelledby="compare-heading">
      <div className="grid-page gap-y-4 mb-8">
        <h2 id="compare-heading" className="col-span-12 md:col-span-6 text-[32px] md:text-[44px] tracking-tight font-light">Design and built</h2>
        <p className="col-span-12 md:col-start-8 md:col-span-5 md:self-end text-[15px] text-ink-muted max-w-[40ch]">
          The same house as designed in 3D and as completed on site. Drag, or use the arrow keys, to compare.
        </p>
      </div>
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden comparison-container bg-stone-1 outline-offset-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
        <img src={built} alt="Built photograph" className="absolute inset-0 size-full object-cover" />
        <img
          src={design}
          alt="Design visualisation"
          className="absolute inset-0 size-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div className="absolute inset-y-0 w-px bg-lime pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-11 rounded-full bg-lime text-ink flex items-center justify-center text-[13px]" aria-hidden="true">
            ⇆
          </span>
        </div>
        <span className="absolute left-4 bottom-4 text-[13px] text-lime [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">Design</span>
        <span className="absolute right-4 bottom-4 text-[13px] text-lime [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">Built</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Reveal the design visualisation"
          className="absolute inset-0 size-full opacity-0 cursor-ew-resize"
        />
      </div>
    </section>
  );
};
