import React, { useState } from 'react';
import { ASSETS } from '../../constants/assets';
import { PROJECTS } from '../data';
import { Button, Card, CardHeader, CMS_ASSETS, Field, Grip, ImageTile } from '../ui';
import { cn } from '../cn';

interface Section {
  id: string;
  label: string;
  visible: boolean;
}

const INITIAL_SECTIONS: Section[] = [
  { id: 'hero', label: 'Hero', visible: true },
  { id: 'work', label: 'Selected work', visible: true },
  { id: 'intro', label: 'Studio intro', visible: true },
  { id: 'services', label: 'Services', visible: true },
  { id: 'footer', label: 'Footer', visible: false },
];

export const HomepageEditorPage: React.FC = () => {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [selected, setSelected] = useState('hero');
  const [dragId, setDragId] = useState<string | null>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [focal, setFocal] = useState({ x: 61, y: 44 });
  const [headline, setHeadline] = useState('Spaces that speak for themselves.');
  const [intro, setIntro] = useState('Flowspace Architects is an architecture and design studio led by Chief Architect Ar. Rashid Ali.');
  const [imageType, setImageType] = useState('Render');
  const [caption, setCaption] = useState('Design visualisation');
  const [alt, setAlt] = useState('Front of a house in Wayanad with a sloping roof, 3D visualisation');
  const [featured, setFeatured] = useState(PROJECTS.filter((p) => p.onHomepage).map((p) => p.name));
  const [adding, setAdding] = useState(false);
  const [published, setPublished] = useState('Changes go live when you publish · last published 10 Oct');

  const toggleVisible = (id: string) => setSections((s) => s.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)));

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setSections((s) => {
      const from = s.findIndex((x) => x.id === dragId);
      const to = s.findIndex((x) => x.id === targetId);
      const next = [...s];
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
    setDragId(null);
  };

  const setFocalFromClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setFocal({ x: Math.round(((e.clientX - r.left) / r.width) * 100), y: Math.round(((e.clientY - r.top) / r.height) * 100) });
  };

  const current = sections.find((s) => s.id === selected)!;
  const addable = PROJECTS.map((p) => p.name).filter((n) => !featured.includes(n));

  return (
    <div className="flex flex-col gap-[28px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-[8px]">
          <h1 className="cms-display-s">Homepage</h1>
          <p className="cms-body text-cms-muted">{published}</p>
        </div>
        <div className="flex gap-[12px]">
          <Button variant="ghost" onClick={() => window.open('#/', '_blank')}>Preview</Button>
          <Button variant="secondary" onClick={() => setPublished('Draft saved just now · last published 10 Oct')}>Save draft</Button>
          <Button onClick={() => setPublished('Published just now')}>Publish homepage</Button>
        </div>
      </div>

      <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
        {/* Sections */}
        <div className="flex w-full flex-col gap-[4px] border border-cms-line px-[12px] py-[20px] xl:w-[220px] xl:shrink-0">
          <p className="cms-caps pb-[8px] pl-[8px] text-cms-muted">Sections</p>
          {sections.map((s) => (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDragId(s.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(s.id)}
              onDragEnd={() => setDragId(null)}
              className={cn(
                'flex items-center gap-[10px] px-[8px] py-[10px] transition-colors',
                selected === s.id ? 'bg-cms-surface' : 'hover:bg-cms-surface/60',
                dragId === s.id && 'opacity-50',
              )}
            >
              <Grip />
              <button onClick={() => setSelected(s.id)} className={cn('cms-nav flex-1 text-left', selected === s.id ? 'text-cms-ink' : 'text-cms-muted')}>
                {s.label}
              </button>
              <button
                onClick={() => toggleVisible(s.id)}
                aria-pressed={s.visible}
                aria-label={`${s.visible ? 'Hide' : 'Show'} ${s.label}`}
                className={cn('cms-body', s.visible ? 'text-cms-ink' : 'text-cms-stone-3')}
              >
                ◉
              </button>
            </div>
          ))}
          <p className="cms-body pl-[8px] pt-[12px] text-cms-muted">Drag to reorder<br />◉ show / hide</p>
        </div>

        {/* Live preview */}
        <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <p className="cms-caps text-cms-muted">Live preview</p>
            <div className="flex" role="group" aria-label="Preview size">
              {(['desktop', 'mobile'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  aria-pressed={device === d}
                  className={cn('cms-body px-[12px] py-[6px] capitalize', device === d ? 'bg-cms-ink text-white' : 'border border-cms-line py-[5px] text-cms-muted')}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className={cn('mx-auto w-full border border-cms-line transition-[max-width] duration-300', device === 'mobile' ? 'max-w-[390px]' : 'max-w-full')}>
            <div className="flex items-center gap-[6px] bg-cms-surface py-[8px] pl-[12px]">
              {[0, 1, 2].map((i) => <img key={i} src={CMS_ASSETS.browserDot} width={8} height={8} alt="" />)}
              <p className="cms-body whitespace-pre text-cms-muted">{'  flowspacearchitects.com'}</p>
            </div>
            <div className="flex flex-col gap-[16px] px-[20px] pb-[20px] pt-[16px]">
              <div className="flex items-center justify-between gap-4 border-b border-cms-line pb-[12px]">
                <span className="flex items-center gap-[8.4px]">
                  <img src={CMS_ASSETS.emblemSm} width={25.2} height={25.2} alt="" />
                  <span className="font-didact text-[10.5px] tracking-[2.94px]">FLOWSPACE</span>
                </span>
                {device === 'desktop' && <p className="cms-body hidden whitespace-pre sm:block">{'Projects   Studio   Journal   Contact'}</p>}
                <p className={cn('cms-body', device === 'desktop' && 'sm:hidden')}>Menu</p>
              </div>

              {!current.visible && (
                <p className="cms-body border border-dashed border-cms-stone-3 p-[12px] text-cms-muted">{current.label} is hidden on the live site.</p>
              )}

              <div className={cn('relative flex flex-col gap-[12px] border border-cms-ink p-[12px]', !current.visible && 'opacity-40')}>
                <span className="cms-caps self-start bg-cms-ink px-[8px] py-[3px] text-white">{current.label} — editing</span>
                {selected === 'hero' ? (
                  <>
                    <p className="cms-display-m">{headline}</p>
                    <p className="cms-body text-cms-muted">{intro}</p>
                    <div
                      onClick={setFocalFromClick}
                      className="relative h-[330px] cursor-crosshair"
                      title="Click to set the focal point"
                    >
                      <ImageTile
                        src={ASSETS.projectCloudHouse}
                        alt={alt}
                        caption={`Residence, Wayanad — ${caption.toLowerCase()}`}
                        className="h-full"
                        objectPosition={`${focal.x}% ${focal.y}%`}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute size-[28px] -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${focal.x}%`, top: `${focal.y}%` }}
                      >
                        <img src={CMS_ASSETS.focalRing} width={28} height={28} alt="" className="absolute inset-0" />
                        <img src={CMS_ASSETS.focalDot} width={6} height={6} alt="" className="absolute left-[11px] top-[11px]" />
                      </span>
                    </div>
                  </>
                ) : (
                  <ImageTile caption={`${current.label} section`} className="h-[220px]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel */}
        <div className="flex w-full flex-col gap-[16px] xl:w-[340px] xl:shrink-0">
          <Card>
            <CardHeader title="Hero image" meta="1 of 3" />
            <ImageTile src={ASSETS.projectCloudHouse} alt="" caption="Current" className="h-[170px]" />
            <div className="flex gap-[8px]">
              <Button variant="secondary" className="flex-1 justify-start">Replace</Button>
              <Button variant="ghost" className="flex-1 justify-start">From library</Button>
            </div>
            <p className="cms-body text-cms-muted">Add up to 3 images to rotate. Click the preview to set the focal point so the crop works on phones.</p>
            <div className="flex gap-[12px]">
              <Field className="flex-1" label="Type" value={imageType} onChange={setImageType} options={['Render', 'Photo']} />
              <Field className="flex-1" label="Caption" value={caption} onChange={setCaption} multiline rows={2} />
            </div>
            <Field label="Alt text" value={alt} onChange={setAlt} multiline rows={2} />
          </Card>

          <Card>
            <CardHeader title="Headline & intro" />
            <Field label="Headline" value={headline} onChange={setHeadline} counter={{ max: 40 }} />
            <Field label="Intro" value={intro} onChange={setIntro} multiline rows={3} counter={{ max: 180 }} />
          </Card>

          <section className="flex flex-col border border-cms-line p-[20px]">
            <CardHeader title="Featured projects" meta={`${featured.length} of 4`} />
            {featured.map((name) => (
              <div key={name} className="cms-body flex items-center gap-[10px] border-t border-cms-line py-[12px]">
                <Grip />
                <span className="flex-1">{name}</span>
                <button aria-label={`Remove ${name}`} onClick={() => setFeatured((f) => f.filter((x) => x !== name))} className="text-cms-muted hover:text-cms-ink">✕</button>
              </div>
            ))}
            <div className="border-t border-cms-line pt-[12px]">
              {adding ? (
                <select
                  autoFocus
                  defaultValue=""
                  aria-label="Add a featured project"
                  onBlur={() => setAdding(false)}
                  onChange={(e) => { setFeatured((f) => [...f, e.target.value]); setAdding(false); }}
                  className="cms-body w-full border border-cms-line bg-white px-[10px] py-[8px] outline-none"
                >
                  <option value="" disabled>Choose a project…</option>
                  {addable.map((n) => <option key={n}>{n}</option>)}
                </select>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  disabled={featured.length >= 4 || addable.length === 0}
                  className="cms-nav hover:underline disabled:text-cms-stone-3 disabled:no-underline"
                >
                  + Add project
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
