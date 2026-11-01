import React, { useMemo, useState } from 'react';
import { RESEARCH_DATA, type ResearchType } from '../../data/research';
import { Field, PageHeader, Tabs } from '../ui';

type Tab = 'all' | 'study' | 'paper';

const TAB_TYPE: Record<Tab, ResearchType | null> = { all: null, study: 'Study', paper: 'Paper' };

export const ResearchPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');

  const count = (t: ResearchType | null) => RESEARCH_DATA.filter((r) => !t || r.type === t).length;

  const rows = useMemo(() => RESEARCH_DATA.filter((r) => {
    const t = TAB_TYPE[tab];
    return (!t || r.type === t) && r.title.toLowerCase().includes(query.trim().toLowerCase());
  }), [tab, query]);

  return (
    <div className="flex flex-col gap-[32px] pt-2">
      <PageHeader
        title="Research"
        subtitle={`${RESEARCH_DATA.length} entries · ${count('Paper')} papers, ${count('Study')} studies`}
      />

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'all', label: 'All', count: count(null) },
          { id: 'study', label: 'Studies', count: count('Study') },
          { id: 'paper', label: 'Papers', count: count('Paper') },
        ]}
      />

      <div className="grid gap-[16px] md:grid-cols-3">
        <Field label="Search" value={query} onChange={setQuery} placeholder="Search by title…" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="cms-caps border-b border-cms-ink text-cms-muted">
              <th className="px-[12px] py-[10px] font-medium">Title</th>
              <th className="w-[100px] px-[8px] py-[10px] font-medium">Type</th>
              <th className="w-[280px] px-[8px] py-[10px] font-medium">Venue</th>
              <th className="w-[90px] py-[10px] pl-[8px] pr-[12px] font-medium">Year</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-cms-line">
                <td className="cms-nav max-w-[360px] px-[12px] py-[16px] text-cms-ink">{r.title}</td>
                <td className="cms-body px-[8px] py-[16px] text-cms-muted">{r.type}</td>
                <td className="cms-body px-[8px] py-[16px] text-cms-muted">{r.venue}</td>
                <td className="cms-body py-[16px] pl-[8px] pr-[12px] text-cms-muted">{r.year}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="cms-body px-[12px] py-[32px] text-cms-muted">No research matches these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
