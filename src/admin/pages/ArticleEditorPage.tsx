import React, { useState } from 'react';
import { ASSETS } from '../../constants/assets';
import { ARTICLE_CATEGORIES } from '../data';
import { Button, Card, CardHeader, Field, Grip, ImageTile, InlineSelect, StatusPill, Toggle, type Status } from '../ui';
import { cn } from '../cn';

const TOOLBAR: (string | '|')[] = ['Paragraph ▾', '|', 'B', 'I', '|', 'H2', 'H3', '|', 'Link', 'List', 'Quote', 'Image', 'Table', '|', 'FAQ', 'Tip box'];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const ArticleEditorPage: React.FC = () => {
  const [status, setStatus] = useState<Status>('In review');
  const [title, setTitle] = useState('Eco-home materials you can source near Wayanad');
  const [slug, setSlug] = useState('eco-home-materials-wayanad');
  const [alt, setAlt] = useState('Laterite and timber facade of a house in Wayanad, 3D visualisation');
  const [imageType, setImageType] = useState('Render');
  const [hasCover, setHasCover] = useState(true);
  const [block, setBlock] = useState('H2');
  const [publish, setPublish] = useState('Immediately');
  const [category, setCategory] = useState('Climate & materials');
  const [shortAnswer, setShortAnswer] = useState('Laterite, local timber, bamboo and lime are the most practical eco-materials near Wayanad. Each suits the climate if detailed for heavy monsoon rain.');
  const [faqs, setFaqs] = useState(['Is laterite good for building in Wayanad?', 'Does bamboo last in heavy rain?', 'Is lime plaster expensive?']);
  const [metaTitle, setMetaTitle] = useState('Eco-home materials near Wayanad | Flowspace');
  const [metaDesc, setMetaDesc] = useState('Laterite, timber, bamboo and lime: which local materials work for homes in Wayanad, and how to detail them for the monsoon.');
  const [schema, setSchema] = useState({ Article: true, FAQPage: true, 'Author (Person)': true, Breadcrumbs: true });
  const [saved, setSaved] = useState('Autosaved 2 min ago · Version 4');

  const addFaq = () => {
    const q = window.prompt('New FAQ question');
    if (q?.trim()) setFaqs((f) => [...f, q.trim()]);
  };

  return (
    <div className="flex flex-col gap-[28px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-[8px]">
          <h1 className="cms-display-s">Edit article</h1>
          <p className="cms-body text-cms-muted">{saved}</p>
        </div>
        <div className="flex gap-[12px]">
          <Button variant="ghost" onClick={() => (window.location.hash = '#/article')}>Preview</Button>
          <Button variant="secondary" onClick={() => setSaved('Saved just now · Version 5')}>Save draft</Button>
        </div>
      </div>

      {status === 'In review' ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-l-[3px] border-cms-accent bg-cms-surface px-[20px] py-[16px]">
          <div className="flex flex-col gap-[4px]">
            <p className="cms-nav">Submitted for review by Studio Writer · 2 hours ago</p>
            <p className="cms-body text-cms-muted">Writers can’t publish. An Admin or Editor approves or sends it back with notes.</p>
          </div>
          <div className="flex gap-[12px]">
            <Button variant="secondary" onClick={() => setStatus('Draft')}>Request changes</Button>
            <Button onClick={() => setStatus('Published')}>Approve &amp; publish</Button>
          </div>
        </div>
      ) : (
        <div role="status" className="flex flex-wrap items-center justify-between gap-4 border-l-[3px] border-cms-ink bg-cms-surface px-[20px] py-[16px]">
          <p className="cms-nav">{status === 'Published' ? 'Published to the Journal just now.' : 'Sent back to Studio Writer with notes.'}</p>
          <Button variant="ghost" onClick={() => setStatus('In review')}>Undo</Button>
        </div>
      )}

      <div className="flex flex-col gap-[32px] xl:flex-row xl:items-start">
        {/* Editor column */}
        <div className="flex min-w-0 flex-1 flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px] border-b border-cms-line pb-[16px]">
            <label htmlFor="article-title" className="cms-caps text-cms-muted">Title</label>
            <textarea
              id="article-title"
              rows={2}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }}
              className="cms-display-m w-full resize-none overflow-hidden bg-transparent text-cms-ink outline-none [field-sizing:content]"
            />
          </div>

          <Field label="URL" hint="Auto from title" value={`flowspacearchitects.com/journal/${slug}`} onChange={(v) => setSlug(v.replace(/^.*\/journal\//, ''))} />

          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <p className="cms-caps text-cms-muted">Cover image</p>
              <div className="flex gap-[8px]">
                <Button variant="ghost" onClick={() => setHasCover(true)}>Replace</Button>
                <Button variant="ghost" onClick={() => setHasCover(false)} disabled={!hasCover}>Remove</Button>
              </div>
            </div>
            {hasCover ? (
              <ImageTile src={ASSETS.projectHover} alt={alt} caption="Design visualisation" className="h-[300px]" />
            ) : (
              <button onClick={() => setHasCover(true)} className="flex h-[300px] w-full flex-col items-center justify-center gap-[6px] border border-dashed border-cms-stone-3">
                <span className="cms-nav">+ Add a cover image</span>
                <span className="cms-body text-cms-muted">JPG, PNG or WebP · up to 20 MB</span>
              </button>
            )}
            <div className="flex flex-col gap-[16px] md:flex-row">
              <Field className="flex-1" label="Alt text" hint="For Google & screen readers" value={alt} onChange={setAlt} multiline rows={2} />
              <Field className="md:w-[400px] md:shrink-0" label="Image type" value={imageType} onChange={setImageType} options={['Render', 'Photo']} />
            </div>
          </div>

          <div role="toolbar" aria-label="Formatting" className="flex items-center gap-[4px] overflow-x-auto border border-cms-line p-[6px] scrollbar-none [&>*]:shrink-0">
            {TOOLBAR.map((t, i) =>
              t === '|' ? (
                <span key={i} aria-hidden className="h-[20px] w-px bg-cms-line" />
              ) : (
                <button
                  key={t}
                  onClick={() => t !== 'Paragraph ▾' && setBlock(t)}
                  aria-pressed={t === block}
                  className={cn(
                    'cms-body px-[10px] py-[6px] transition-colors hover:bg-cms-surface',
                    t === 'Paragraph ▾' ? 'text-cms-ink' : 'text-cms-muted',
                    t === block && 'bg-cms-surface',
                  )}
                >
                  {t}
                </button>
              ),
            )}
          </div>

          <div
            className="flex flex-col gap-[20px] border border-cms-line px-[20px] py-[28px] outline-none focus-within:border-cms-ink md:px-[32px]"
          >
            <h2 contentEditable suppressContentEditableWarning className="cms-display-s outline-none">Why local materials matter</h2>
            <p contentEditable suppressContentEditableWarning className="cms-body-l outline-none">
              Materials from near the site travel less, cost less and usually suit the climate better. In Wayanad that means laterite, local timber, bamboo and lime — each with its own strengths and limits.
            </p>
            <div className="flex flex-col gap-[6px] border border-cms-ink p-[12px]">
              <p contentEditable suppressContentEditableWarning className="cms-nav outline-none">Laterite</p>
              <p contentEditable suppressContentEditableWarning className="cms-body-l outline-none">
                Cut from local quarries, laterite blocks breathe, age well and keep interiors cool. Plaster or leave exposed, but protect the top courses from rain.
              </p>
            </div>
            <h2 contentEditable suppressContentEditableWarning className="cms-display-s outline-none">Bamboo and timber</h2>
            <p
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Start writing, or type “/” to add an image, table, FAQ or tip box…"
              className="cms-body-l min-h-[1.4em] outline-none empty:before:text-cms-stone-3 empty:before:content-[attr(data-placeholder)]"
            />
          </div>
        </div>

        {/* Side panel */}
        <div className="flex w-full flex-col gap-[16px] xl:w-[360px] xl:shrink-0">
          <Card>
            <CardHeader title="Publishing" />
            <Row label="Status"><StatusPill status={status} /></Row>
            <Row label="Author">Studio Writer</Row>
            <Row label="Reviewer">Ar. Rashid Ali</Row>
            <Row label="Publish"><InlineSelect value={publish} onChange={setPublish} options={['Immediately', 'Schedule…']} label="Publish timing" /></Row>
            <Row label="Category"><InlineSelect value={category} onChange={setCategory} options={ARTICLE_CATEGORIES} label="Category" /></Row>
          </Card>

          <Card>
            <CardHeader title="Answer engines (AEO)" meta="Required" />
            <Field label="Short answer" value={shortAnswer} onChange={setShortAnswer} multiline rows={4} counter={{ max: 300 }} />
            <p className="cms-body text-cms-muted">Shown at the top of the article. Search engines and AI assistants quote this first.</p>
            <div className="flex flex-col">
              <div className="flex items-start justify-between pb-[8px]">
                <p className="cms-caps text-cms-muted">FAQ · {faqs.length} questions</p>
                <button onClick={addFaq} className="cms-nav hover:underline">+ Add</button>
              </div>
              {faqs.map((q) => (
                <div key={q} className="flex items-start gap-[10px] border-t border-cms-line py-[10px]">
                  <Grip />
                  <p className="cms-body flex-1">{q}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Search (SEO)" />
            <Field label="Meta title" value={metaTitle} onChange={setMetaTitle} multiline rows={2} counter={{ max: 60 }} />
            <Field label="Meta description" value={metaDesc} onChange={setMetaDesc} multiline rows={4} counter={{ max: 160 }} />
            <div className="flex flex-col gap-[4px] bg-cms-surface p-[14px]">
              <p className="cms-caps text-cms-muted">Google preview</p>
              <p className="cms-body text-cms-muted">flowspacearchitects.com › journal</p>
              <p className="cms-nav">{metaTitle}</p>
              <p className="cms-body text-cms-muted">{metaDesc.length > 115 ? `${metaDesc.slice(0, 115).trimEnd()}…` : metaDesc}</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Structured data" meta="Auto" />
            {(Object.keys(schema) as (keyof typeof schema)[]).map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="cms-body text-cms-muted">{k}</span>
                <Toggle label={k} checked={schema[k]} onChange={(v) => setSchema((s) => ({ ...s, [k]: v }))} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="cms-body flex items-center justify-between gap-4">
    <span className="text-cms-muted">{label}</span>
    <span className="text-cms-ink">{children}</span>
  </div>
);
