import React from 'react';
import { ARTICLES } from '../data';
import { adminHref } from '../routes';
import { Button, CMS_ASSETS, PageHeader, StatusPill, type Status } from '../ui';

const STATS = [
  { label: 'Published articles', value: ARTICLES.filter((a) => a.status === 'Published').length, note: '+1 this month' },
  { label: 'Drafts', value: ARTICLES.filter((a) => a.status === 'Draft').length, note: 'Last edited yesterday' },
  { label: 'Waiting for review', value: ARTICLES.filter((a) => a.status === 'In review').length, note: 'From Studio Writer' },
  { label: 'Projects', value: 6, note: 'All completed' },
];

const RECENT: { title: string; kind: string; status: Status; date: string; href: string }[] = [
  { title: 'Design vs built: the Commercial Space', kind: 'Article', status: 'Draft', date: 'Yesterday', href: adminHref('articles', 'edit') },
  { title: 'How much does it cost to build a house in Wayanad in 2026?', kind: 'Article', status: 'Published', date: '12 Oct', href: adminHref('articles', 'edit') },
  { title: 'Homepage — hero image', kind: 'Homepage', status: 'Published', date: '10 Oct', href: adminHref('homepage') },
  { title: 'Residence', kind: 'Project', status: 'Published', date: '3 Oct', href: adminHref('projects', 'residence') },
];

const QUICK = [
  { label: 'Write a new article', href: adminHref('articles', 'edit') },
  { label: 'Add a project', href: adminHref('projects', 'new') },
  { label: 'Change the hero image', href: adminHref('homepage') },
  { label: 'Upload renders or photos', href: adminHref('media') },
];

const CHECKS = [
  { label: '2 articles have no FAQ block', ok: false },
  { label: '1 article has no short answer', ok: false },
  { label: '4 project images missing alt text', ok: false },
  { label: 'All articles have an author and date', ok: true },
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const DashboardPage: React.FC = () => (
  <div className="flex flex-col gap-[32px] pt-2">
    <PageHeader
      title={`${greeting()}, Rashid`}
      subtitle="Here’s what’s happening on flowspacearchitects.com."
      actions={
        <>
          <Button variant="secondary" onClick={() => (window.location.hash = adminHref('homepage'))}>Change hero image</Button>
          <Button onClick={() => (window.location.hash = adminHref('articles', 'edit'))}>New article</Button>
        </>
      }
    />

    <div className="grid grid-cols-2 gap-[16px] xl:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col gap-[8px] border border-cms-line p-[24px]">
          <p className="cms-caps text-cms-muted">{s.label}</p>
          <p className="cms-display-m text-cms-ink">{s.value}</p>
          <p className="cms-body text-cms-muted">{s.note}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-[16px] xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
        <section className="flex flex-col gap-[16px] border border-cms-line p-[24px]">
          <div className="flex items-center justify-between">
            <h2 className="cms-nav">Waiting for your review</h2>
            <span className="cms-caps text-cms-muted">1 item</span>
          </div>
          <div className="flex flex-wrap items-center gap-[16px] border-t border-cms-line pt-[16px]">
            <div className="flex min-w-[220px] flex-1 flex-col gap-[4px]">
              <p className="cms-nav">Eco-home materials you can source near Wayanad</p>
              <p className="cms-body text-cms-muted">Article · Studio Writer · submitted 2 hours ago</p>
            </div>
            <StatusPill status="In review" />
            <Button variant="secondary" onClick={() => (window.location.hash = adminHref('articles', 'edit'))}>Review</Button>
          </div>
        </section>

        <section className="flex flex-col gap-[16px] border border-cms-line p-[24px]">
          <div className="flex items-center justify-between">
            <h2 className="cms-nav">Recently edited</h2>
            <a href={adminHref('articles')} className="cms-caps text-cms-muted hover:text-cms-ink">View all</a>
          </div>
          {RECENT.map((r) => (
            <a key={r.title} href={r.href} className="group flex items-center gap-[16px] border-t border-cms-line pb-[2px] pt-[14px]">
              <p className="cms-body min-w-0 flex-1 group-hover:underline">{r.title}</p>
              <p className="cms-body hidden w-[100px] text-cms-muted sm:block">{r.kind}</p>
              <StatusPill status={r.status} />
              <p className="cms-body w-[80px] text-right text-cms-muted">{r.date}</p>
            </a>
          ))}
        </section>
      </div>

      <div className="flex w-full flex-col gap-[16px] xl:w-[380px] xl:shrink-0">
        <section className="flex flex-col border border-cms-line p-[24px]">
          <h2 className="cms-nav">Quick actions</h2>
          {QUICK.map((q) => (
            <a key={q.label} href={q.href} className="cms-body flex justify-between border-t border-cms-line py-[14px] hover:bg-cms-surface/60">
              <span>{q.label}</span>
              <span aria-hidden>→</span>
            </a>
          ))}
        </section>

        <section className="flex flex-col gap-[16px] border border-cms-line p-[24px]">
          <div className="flex items-center justify-between">
            <h2 className="cms-nav">SEO &amp; AEO checks</h2>
            <span className="cms-caps text-cms-muted">{CHECKS.filter((c) => !c.ok).length} to fix</span>
          </div>
          <ul className="flex flex-col gap-[16px]">
            {CHECKS.map((c) => (
              <li key={c.label} className="flex items-center gap-[12px]">
                <img src={c.ok ? CMS_ASSETS.dotInk8 : CMS_ASSETS.dotAccent8} width={8} height={8} alt="" />
                <span className={c.ok ? 'cms-body text-cms-muted' : 'cms-body'}>{c.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  </div>
);
