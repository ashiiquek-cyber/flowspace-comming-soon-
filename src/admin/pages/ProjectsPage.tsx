import React, { useState } from 'react';
import { PROJECTS } from '../data';
import { adminHref } from '../routes';
import { Button, ImageTile, PageHeader, StatusPill, Tabs, Tag } from '../ui';
import { cn } from '../cn';

type Tab = 'all' | 'featured' | 'renders' | 'alt';

export const ProjectsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('all');
  const featured = PROJECTS.filter((p) => p.onHomepage);
  const needsAlt = PROJECTS.filter((p) => p.missingAlt > 0);
  const visible = tab === 'featured' ? featured : tab === 'alt' ? needsAlt : PROJECTS;

  return (
    <div className="flex flex-col gap-[28px]">
      <PageHeader
        title="Projects"
        subtitle={`${PROJECTS.length} projects · ${featured.length} featured on homepage`}
        actions={<Button onClick={() => (window.location.hash = adminHref('projects', 'new'))}>Add project</Button>}
      />

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'all', label: 'All', count: PROJECTS.length },
          { id: 'featured', label: 'Featured', count: featured.length },
          { id: 'renders', label: 'Renders only', count: PROJECTS.length },
          { id: 'alt', label: 'Needs alt text', count: needsAlt.length },
        ]}
      />

      <div className="grid gap-[20px] sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <a key={p.id} href={adminHref('projects', p.id)} className="group flex flex-col border border-cms-line pb-[20px] transition-colors hover:border-cms-ink">
            <ImageTile src={p.image} alt={p.name} caption="Design visualisation" className="h-[220px]" />
            <div className="flex flex-col gap-[10px] px-[16px] pt-[16px]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="cms-nav">{p.name}</h2>
                <StatusPill status="Published" />
              </div>
              <p className="cms-body text-cms-muted">{p.meta}</p>
              <div className="flex gap-[8px]">
                <Tag>Completed</Tag>
                {p.onHomepage && <Tag solid>On homepage</Tag>}
              </div>
              <p className={cn('cms-body', p.missingAlt ? 'text-cms-accent' : 'text-cms-muted')}>
                {p.images} images · {p.images} renders{p.missingAlt ? ` · ${p.missingAlt} missing alt` : ''}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
