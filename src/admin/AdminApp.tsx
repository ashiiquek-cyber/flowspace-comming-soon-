import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ASSETS } from '../constants/assets';
import { RESEARCH_DATA } from '../data/research';
import { ARTICLES, PROJECTS, TEAM } from './data';
import { CMS_ASSETS } from './ui';
import { cn } from './cn';
import { adminHref, parseAdminHash, type AdminRoute, type AdminSection } from './routes';
import { DashboardPage } from './pages/DashboardPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleEditorPage } from './pages/ArticleEditorPage';
import { ResearchPage } from './pages/ResearchPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectEditorPage } from './pages/ProjectEditorPage';
import { HomepageEditorPage } from './pages/HomepageEditorPage';
import { TeamPage } from './pages/TeamPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const NAV: { group: string; items: { id: AdminSection; label: string; count?: number }[] }[] = [
  {
    group: 'Content',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'articles', label: 'Articles', count: ARTICLES.length },
      { id: 'research', label: 'Research', count: RESEARCH_DATA.length },
      { id: 'projects', label: 'Projects', count: PROJECTS.length },
      { id: 'homepage', label: 'Homepage' },
      { id: 'media', label: 'Media library' },
    ],
  },
  {
    group: 'Studio',
    items: [
      { id: 'team', label: 'Team & roles', count: TEAM.length },
      { id: 'settings', label: 'Settings' },
    ],
  },
];

const Sidebar: React.FC<{ active: AdminSection; onNavigate: () => void }> = ({ active, onNavigate }) => (
  <div className="flex h-full flex-col justify-between overflow-y-auto px-[16px] py-[24px]">
    <div className="flex flex-col gap-[32px]">
      <a href="#/" className="flex items-center gap-[10px] pl-[8px]" aria-label="Flowspace CMS — view site">
        <span className="flex items-center gap-[12px]">
          <img src={ASSETS.emblemDark} width={36} height={36} alt="" />
          <span className="font-didact text-[15px] tracking-[4.2px] text-cms-ink">FLOWSPACE</span>
        </span>
        <span className="cms-caps text-cms-muted">CMS</span>
      </a>

      <nav aria-label="CMS" className="flex flex-col gap-[32px]">
        {NAV.map((group) => (
          <div key={group.group} className="flex flex-col gap-[2px]">
            <p className="cms-caps pb-[8px] pl-[12px] text-cms-muted">{group.group}</p>
            {group.items.map((item) => {
              const isActive = item.id === active;
              return (
                <a
                  key={item.id}
                  href={adminHref(item.id)}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[44px] items-center gap-[12px] px-[12px] py-[10px] transition-colors',
                    isActive ? 'bg-cms-surface' : 'hover:bg-cms-surface/60',
                  )}
                >
                  <span className={cn('size-[8px] shrink-0', isActive ? 'bg-cms-ink' : 'border border-cms-stone-3')} />
                  <span className={cn('cms-nav flex-1', isActive ? 'text-cms-ink' : 'text-cms-muted')}>{item.label}</span>
                  {item.count !== undefined && <span className="cms-body text-cms-muted">{item.count}</span>}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
    </div>

    <div className="mt-10 flex flex-col gap-[16px]">
      <a href="#/" target="_blank" rel="noopener" className="cms-nav pl-[12px] text-cms-ink hover:underline">View live site ↗</a>
      <div className="flex items-center gap-[12px] border-t border-cms-line pl-[12px] pt-[16px]">
        <img src={CMS_ASSETS.avatar36} width={36} height={36} alt="" />
        <div className="flex flex-col gap-[2px] whitespace-nowrap">
          <p className="cms-nav text-cms-ink">Ar. Rashid Ali</p>
          <p className="cms-body text-cms-muted">Admin</p>
        </div>
      </div>
    </div>
  </div>
);

const BREADCRUMBS: Record<AdminSection, string> = {
  dashboard: 'Dashboard',
  articles: 'Content / Articles',
  research: 'Content / Research',
  projects: 'Content / Projects',
  homepage: 'Content / Homepage',
  media: 'Content / Media library',
  team: 'Studio / Team & roles',
  settings: 'Studio / Settings',
};

const crumbFor = ({ section, param }: AdminRoute) => {
  if (section === 'articles' && param) return 'Content / Articles / Edit';
  if (section === 'projects' && param) {
    const project = PROJECTS.find((p) => p.id === param);
    return `Content / Projects / ${project?.name ?? 'New project'}`;
  }
  return BREADCRUMBS[section];
};

// The CMS face (DM Sans) is self-hosted in src/index.css; browsers fetch it only once CMS text uses it

export const AdminApp: React.FC = () => {
  const [route, setRoute] = useState<AdminRoute>(() => parseAdminHash(window.location.hash));
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onHash = () => {
      setRoute(parseAdminHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = `${crumbFor(route).split(' / ').pop()} — Flowspace CMS`;
  }, [route]);

  const { section, param } = route;

  let page: React.ReactNode;
  switch (section) {
    case 'articles': page = param ? <ArticleEditorPage /> : <ArticlesPage initialQuery={query} />; break;
    case 'research': page = <ResearchPage />; break;
    case 'projects': page = param ? <ProjectEditorPage projectId={param} /> : <ProjectsPage />; break;
    case 'homepage': page = <HomepageEditorPage />; break;
    case 'team': page = <TeamPage />; break;
    case 'media': page = <PlaceholderPage title="Media library" />; break;
    case 'settings': page = <PlaceholderPage title="Settings" />; break;
    default: page = <DashboardPage />;
  }

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash = adminHref('articles');
  };

  return (
    <div className="cms-root flex min-h-screen">
      {/* Fixed sidebar on desktop, drawer below lg */}
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 border-r border-cms-line bg-white lg:block">
        <Sidebar active={section} onNavigate={() => undefined} />
      </aside>
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-cms-ink/30" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] border-r border-cms-line bg-white animate-in">
            <Sidebar active={section} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-cms-line px-4 py-[16px] md:px-[40px]">
          <div className="flex items-center gap-3">
            <button className="-ml-1 p-1 lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <p className="cms-caps text-cms-muted">{crumbFor(route)}</p>
          </div>
          <div className="flex items-center gap-[16px]">
            <form onSubmit={onSearch} role="search" className="hidden sm:block">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, projects…"
                aria-label="Search articles and projects"
                className="w-[280px] border border-cms-line px-[14px] py-[9px] cms-body text-cms-ink outline-none placeholder:text-cms-stone-3 focus:border-cms-ink"
              />
            </form>
            <p className="cms-caps text-cms-muted">Admin</p>
          </div>
        </header>

        <main key={`${section}-${param ?? ''}`} className="page-enter px-4 pb-[56px] pt-[32px] md:px-[40px]">
          {page}
        </main>
      </div>
    </div>
  );
};
