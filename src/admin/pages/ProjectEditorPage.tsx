import React, { useState } from 'react';
import { ASSETS } from '../../constants/assets';
import { PROJECTS } from '../data';
import { Button, Card, CardHeader, Field, ImageTile, InlineSelect, StatusPill, Tag, Toggle } from '../ui';
import { cn } from '../cn';

interface GalleryImage {
  src: string;
  caption: string;
  alt: string;
}

const INITIAL_GALLERY: GalleryImage[] = [
  { src: ASSETS.projectCloudHouse, caption: 'Front elevation', alt: 'Front of the house with sloping tiled roof, 3D visualisation' },
  { src: ASSETS.projectTerraVilla, caption: 'Living room', alt: 'Double-height living room with timber ceiling, 3D visualisation' },
  { src: ASSETS.projectHover, caption: 'Courtyard', alt: '' },
  { src: ASSETS.founderPhoto, caption: 'Bedroom', alt: 'Bedroom opening to the garden, 3D visualisation' },
];

export const ProjectEditorPage: React.FC<{ projectId: string }> = ({ projectId }) => {
  const project = PROJECTS.find((p) => p.id === projectId);
  const isNew = !project;
  const [category, discipline] = (project?.meta ?? 'Residential · Architecture').split(' · ');

  const [f, setF] = useState({
    name: project?.name ?? '',
    category,
    discipline,
    status: 'Completed',
    location: 'Wayanad, Kerala',
    year: 'TBC',
    client: 'Private client',
    area: 'TBC',
    description: '',
    caption: 'Design visualisation',
    photographer: '—',
    metaTitle: `${project?.name ?? 'Residence'} in Wayanad | Flowspace Architects`,
    metaDesc: 'A family home in Wayanad by Flowspace Architects — layout, materials and design approach.',
    url: `/projects/${projectId === 'residence' ? 'residence-wayanad' : projectId}`,
  });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const [gallery, setGallery] = useState<GalleryImage[]>(isNew ? [] : INITIAL_GALLERY);
  const [editingAlt, setEditingAlt] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  // The grid previews the first four; the rest of the project's images live in the media library
  const offGrid = isNew ? 0 : Math.max(0, project.images - INITIAL_GALLERY.length);

  const moveImage = (to: number) => {
    if (dragIndex === null || dragIndex === to) return;
    setGallery((g) => {
      const next = [...g];
      next.splice(to, 0, next.splice(dragIndex, 1)[0]);
      return next;
    });
    setDragIndex(null);
  };
  const [vis, setVis] = useState({ projects: true, homepage: project?.onHomepage ?? false, detail: true });
  const [position, setPosition] = useState('1 of 4');
  const [saved, setSaved] = useState(isNew ? 'Not saved yet' : 'Last edited 3 Oct by Ar. Rashid Ali');

  const fileRef = React.useRef<HTMLInputElement>(null);
  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const added = Array.from(files).map((file) => ({ src: URL.createObjectURL(file), caption: file.name.replace(/\.[^.]+$/, ''), alt: '' }));
    setGallery((g) => [...g, ...added]);
  };

  return (
    <div className="flex flex-col gap-[28px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-[8px]">
          <h1 className="cms-display-s">{f.name || 'New project'}</h1>
          <p className="cms-body text-cms-muted">{saved}</p>
        </div>
        <div className="flex gap-[12px]">
          <Button variant="ghost" onClick={() => (window.location.hash = '#/projects')}>Preview</Button>
          <Button variant="secondary" onClick={() => setSaved('Draft saved just now')}>Save draft</Button>
          <Button onClick={() => setSaved('Published just now by Ar. Rashid Ali')}>Publish changes</Button>
        </div>
      </div>

      <div className="flex flex-col gap-[32px] xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
          <Card>
            <CardHeader title="Project details" />
            <div className="grid gap-[16px] md:grid-cols-2">
              <Field label="Project name" value={f.name} onChange={set('name')} />
              <Field label="Category" value={f.category} onChange={set('category')} options={['Residential', 'Commercial', 'Apartments', 'Retail', 'Furniture']} />
              <Field label="Discipline" value={f.discipline} onChange={set('discipline')} options={['Architecture', 'Interiors', 'Product design']} />
              <Field label="Status" value={f.status} onChange={set('status')} options={['Completed', 'In progress', 'Concept']} />
              <Field label="Location" value={f.location} onChange={set('location')} />
              <Field label="Year completed" value={f.year} onChange={set('year')} />
              <Field label="Client" value={f.client} onChange={set('client')} />
              <Field label="Built area" value={f.area} onChange={set('area')} />
            </div>
            <Field
              label="Description"
              value={f.description}
              onChange={set('description')}
              multiline
              rows={3}
              counter={{ max: 600, unit: 'words' }}
              placeholder="Write 300–600 words: the brief, the site, the idea, materials and how the family uses the house. This text is what helps the project rank in search."
            />
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-[4px]">
                <h2 className="cms-nav">Gallery · {gallery.length + offGrid} images</h2>
                <p className="cms-body text-cms-muted">Drag to reorder. The first image is the cover.</p>
              </div>
              <Button variant="secondary" onClick={() => fileRef.current?.click()}>Upload images</Button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            </div>

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 gap-[16px] lg:grid-cols-4">
                {gallery.map((img, i) => (
                  <div
                    key={img.src}
                    draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => moveImage(i)}
                    onDragEnd={() => setDragIndex(null)}
                    className={cn('flex min-w-0 cursor-grab flex-col gap-[10px]', dragIndex === i && 'opacity-50')}
                  >
                    <ImageTile src={img.src} alt={img.alt} caption={img.caption} className="h-[150px]" />
                    <div className="flex gap-[6px]">
                      <Tag>Render</Tag>
                      {i === 0 && <Tag solid>Cover</Tag>}
                    </div>
                    {editingAlt === i ? (
                      <textarea
                        autoFocus
                        rows={3}
                        defaultValue={img.alt}
                        aria-label={`Alt text for ${img.caption}`}
                        onBlur={(e) => {
                          const alt = e.target.value.trim();
                          setGallery((g) => g.map((x, j) => (j === i ? { ...x, alt } : x)));
                          setEditingAlt(null);
                        }}
                        className="cms-body w-full border border-cms-ink p-2 outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingAlt(i)}
                        className={cn('cms-body text-left hover:underline', img.alt ? 'text-cms-muted' : 'text-cms-accent')}
                      >
                        {img.alt || 'Alt text missing — add one'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
              className="flex cursor-pointer flex-col items-center gap-[6px] border border-dashed border-cms-stone-3 px-4 py-[28px] text-center hover:bg-cms-surface/60"
            >
              <span className="cms-nav">Drop renders or photos here</span>
              <span className="cms-body text-cms-muted">JPG, PNG or WebP · up to 20 MB · tag each as Render or Photo</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            </label>
          </Card>

          <Card>
            <CardHeader title="Design vs built" meta="Optional" />
            <p className="cms-body text-cms-muted">Pair a render with a real photo of the finished building. The site shows them side by side with a slider.</p>
            <div className="grid gap-[16px] md:grid-cols-2">
              <div className="flex flex-col gap-[8px]">
                <ImageTile src={ASSETS.projectCloudHouse} alt="" caption="Render — front elevation" className="h-[200px]" />
                <p className="cms-caps text-cms-muted">Render</p>
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="flex h-[200px] cursor-pointer flex-col items-center justify-center gap-[6px] border border-dashed border-cms-stone-3 px-4 text-center hover:bg-cms-surface/60">
                  <span className="cms-nav">+ Add the real photo</span>
                  <span className="cms-body text-cms-muted">Same angle as the render works best</span>
                  <input type="file" accept="image/*" hidden />
                </label>
                <p className="cms-caps text-cms-muted">Photo</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex w-full flex-col gap-[16px] xl:w-[360px] xl:shrink-0">
          <Card>
            <CardHeader title="Visibility" />
            <VisRow label="Status"><StatusPill status={isNew ? 'Draft' : 'Published'} /></VisRow>
            <VisRow label="Show on Projects page"><Toggle label="Show on Projects page" checked={vis.projects} onChange={(v) => setVis((s) => ({ ...s, projects: v }))} /></VisRow>
            <VisRow label="Feature on homepage"><Toggle label="Feature on homepage" checked={vis.homepage} onChange={(v) => setVis((s) => ({ ...s, homepage: v }))} /></VisRow>
            {vis.homepage && (
              <VisRow label="Homepage position">
                <InlineSelect label="Homepage position" value={position} onChange={setPosition} options={['1 of 4', '2 of 4', '3 of 4', '4 of 4']} />
              </VisRow>
            )}
            <VisRow label="Open detail page"><Toggle label="Open detail page" checked={vis.detail} onChange={(v) => setVis((s) => ({ ...s, detail: v }))} /></VisRow>
          </Card>

          <Card>
            <CardHeader title="Image credits" />
            <Field label="Image caption default" hint="Shown under renders" value={f.caption} onChange={set('caption')} />
            <Field label="Photographer" hint="For real photos" value={f.photographer} onChange={set('photographer')} />
          </Card>

          <Card>
            <CardHeader title="Search (SEO)" />
            <Field label="Meta title" value={f.metaTitle} onChange={set('metaTitle')} multiline rows={2} counter={{ max: 60 }} />
            <Field label="Meta description" value={f.metaDesc} onChange={set('metaDesc')} multiline rows={3} counter={{ max: 160 }} />
            <Field label="URL" value={f.url} onChange={set('url')} />
          </Card>
        </div>
      </div>
    </div>
  );
};

const VisRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="cms-body text-cms-muted">{label}</span>
    {children}
  </div>
);
