import React, { useMemo, useState } from 'react';
import { ARTICLES, ARTICLE_CATEGORIES, AUTHORS } from '../data';
import { adminHref } from '../routes';
import { Button, CMS_ASSETS, Field, PageHeader, StatusPill, Tabs } from '../ui';

type Tab = 'all' | 'published' | 'review' | 'drafts';

const TAB_STATUS: Record<Tab, string | null> = { all: null, published: 'Published', review: 'In review', drafts: 'Draft' };

export const ArticlesPage: React.FC<{ initialQuery?: string }> = ({ initialQuery = '' }) => {
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All categories');
  const [author, setAuthor] = useState('All authors');

  const count = (s: string | null) => ARTICLES.filter((a) => !s || a.status === s).length;

  const rows = useMemo(() => ARTICLES.filter((a) => {
    const s = TAB_STATUS[tab];
    return (!s || a.status === s)
      && (category === 'All categories' || a.category === category)
      && (author === 'All authors' || a.author === author)
      && a.title.toLowerCase().includes(query.trim().toLowerCase());
  }), [tab, query, category, author]);

  return (
    <div className="flex flex-col gap-[32px] pt-2">
      <PageHeader
        title="Articles"
        subtitle={`${ARTICLES.length} articles · ${count('Published')} published`}
        actions={<Button onClick={() => (window.location.hash = adminHref('articles', 'edit'))}>New article</Button>}
      />

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'all', label: 'All', count: count(null) },
          { id: 'published', label: 'Published', count: count('Published') },
          { id: 'review', label: 'In review', count: count('In review') },
          { id: 'drafts', label: 'Drafts', count: count('Draft') },
        ]}
      />

      <div className="grid gap-[16px] md:grid-cols-3">
        <Field label="Search" value={query} onChange={setQuery} placeholder="Search by title…" />
        <Field label="Category" value={category} onChange={setCategory} options={['All categories', ...ARTICLE_CATEGORIES]} />
        <Field label="Author" value={author} onChange={setAuthor} options={['All authors', ...AUTHORS]} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="cms-caps border-b border-cms-ink text-cms-muted">
              <th className="px-[12px] py-[10px] font-medium">Title</th>
              <th className="w-[196px] px-[8px] py-[10px] font-medium">Category</th>
              <th className="w-[166px] px-[8px] py-[10px] font-medium">Author</th>
              <th className="w-[146px] px-[8px] py-[10px] font-medium">Status</th>
              <th className="w-[186px] px-[8px] py-[10px] font-medium">AEO</th>
              <th className="w-[122px] py-[10px] pl-[8px] pr-[12px] font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr
                key={a.id}
                onClick={() => (window.location.hash = adminHref('articles', 'edit'))}
                className="cursor-pointer border-b border-cms-line transition-colors hover:bg-cms-surface/60"
              >
                <td className="px-[12px] py-[16px]">
                  <a href={adminHref('articles', 'edit')} className="cms-nav block max-w-[300px] text-cms-ink" onClick={(e) => e.stopPropagation()}>{a.title}</a>
                </td>
                <td className="cms-body px-[8px] py-[16px] text-cms-muted">{a.category}</td>
                <td className="cms-body px-[8px] py-[16px] text-cms-muted">{a.author}</td>
                <td className="px-[8px] py-[16px]"><StatusPill status={a.status} /></td>
                <td className="px-[8px] py-[16px]">
                  <span className="flex items-center gap-[8px]">
                    <img src={a.aeo === 'Ready' ? CMS_ASSETS.dotInk8 : CMS_ASSETS.dotAccent8} width={8} height={8} alt="" />
                    <span className={a.aeo === 'Ready' ? 'cms-body whitespace-nowrap text-cms-ink' : 'cms-body whitespace-nowrap text-cms-muted'}>{a.aeo}</span>
                  </span>
                </td>
                <td className="cms-body py-[16px] pl-[8px] pr-[12px] text-cms-muted">{a.updated}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="cms-body px-[12px] py-[32px] text-cms-muted">No articles match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
