import React from 'react';
import { adminHref } from '../routes';
import { PageHeader } from '../ui';

/** Sections that are in the nav but not designed yet */
export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col gap-[28px]">
    <PageHeader title={title} subtitle="This section is coming soon." />
    <div className="flex flex-col items-center gap-[6px] border border-dashed border-cms-stone-3 px-4 py-[56px] text-center">
      <p className="cms-nav">Nothing here yet</p>
      <p className="cms-body text-cms-muted">
        Head back to the <a href={adminHref('dashboard')} className="text-cms-ink underline">dashboard</a>.
      </p>
    </div>
  </div>
);
