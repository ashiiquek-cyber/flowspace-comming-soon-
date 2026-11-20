import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScrollContext';
import { LandingPage } from './pages/LandingPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { JournalPage } from './pages/JournalPage';
import { ArticlePage } from './pages/ArticlePage';
import { ResearchPage } from './pages/ResearchPage';
import { PressAwardsPage } from './pages/PressAwardsPage';
import { PROJECTS_DATA, type NavigateTarget, type Page } from './data/projects';
import { hrefFor } from './components/RouteLink';

interface Route {
  page: Page;
  projectId?: string;
  /** A journal article open in the reader */
  articleId?: string;
  section?: string;
}

const parseHash = (): Route => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [head, param] = hash.split('/');
  switch (head) {
    case 'projects': return { page: 'projects' };
    case 'project': return { page: 'project-detail', projectId: param };
    case 'project-detail': return { page: 'project-detail', projectId: PROJECTS_DATA[0].id };
    case 'studio':
    case 'about': return { page: 'studio' };
    case 'contact': return { page: 'studio', section: 'contact-section' };
    case 'journal': return { page: 'journal', articleId: param || undefined };
    case 'article': return { page: 'article' };
    case 'research': return param ? { page: 'research', section: `research-${param}` } : { page: 'research' };
    case 'press':
    case 'awards': return { page: 'press' };
    default: return { page: 'home' };
  }
};

const TITLES: Record<Page, string> = {
  home: 'Flowspace Architects — Architecture & Interior Design Studio | Wayanad & Bengaluru',
  projects: 'Projects — Flowspace Architects',
  'project-detail': 'Project — Flowspace Architects',
  studio: 'Studio and contact — Flowspace Architects',
  journal: 'Journal — Flowspace Architects',
  article: 'Journal — Flowspace Architects',
  research: 'Research — Flowspace Architects',
  press: 'Press and awards — Flowspace Architects',
};

function AppContent() {
  const [route, setRoute] = useState<Route>(parseHash);
  // Bumped when a link to the current address is clicked, so the page still resets or re-jumps
  const [visit, setVisit] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // On every route: reset scroll, retitle, recompute triggers, then jump to a section if asked
  useEffect(() => {
    const project = route.projectId ? PROJECTS_DATA.find((p) => p.id === route.projectId) : undefined;
    // An open journal article titles the page itself (and its effect runs first on a fresh load)
    if (!route.articleId) document.title = project ? `${project.title} — Flowspace Architects` : TITLES[route.page];
    // Native reset too: keyboard scrolling can leave Lenis thinking it is already at the top
    window.scrollTo(0, 0);
    scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (route.section) {
        const el = document.getElementById(route.section);
        if (el) scrollTo(el, { offset: -80 });
      }
    }, 60);
    return () => window.clearTimeout(id);
    // Not keyed on articleId: opening or closing a journal article keeps the reader's place in the list
  }, [route.page, route.projectId, route.section, visit, scrollTo]);

  const navigate = useCallback((target: NavigateTarget) => {
    const href = hrefFor(target);
    if (window.location.hash === href) setVisit((v) => v + 1);
    else window.location.hash = href.slice(1);
  }, []);

  const openProject = useCallback((id: string) => {
    window.location.hash = `/project/${id}`;
  }, []);

  const { page } = route;
  const routeKey = `${page}-${route.projectId ?? ''}`;

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink focus:text-lime focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar currentPage={page} onNavigate={navigate} />

      {/* main stays opaque so the curtain footer never shows through; only its content fades in */}
      <main id="main" className={`relative z-10 flex-1 w-full bg-lime ${page === 'home' ? '' : 'pt-[68px] md:pt-[76px]'}`}>
        <div key={routeKey} className="page-enter">
        {page === 'home' && <LandingPage onNavigate={navigate} onOpenProject={openProject} />}
        {page === 'projects' && <ProjectsPage onNavigate={navigate} onOpenProject={openProject} />}
        {page === 'project-detail' && <ProjectDetailPage onNavigate={navigate} onOpenProject={openProject} projectId={route.projectId} />}
        {page === 'studio' && <AboutContactPage onNavigate={navigate} />}
        {page === 'journal' && <JournalPage onNavigate={navigate} articleId={route.articleId} />}
        {page === 'article' && <ArticlePage onNavigate={navigate} />}
        {page === 'research' && <ResearchPage />}
        {page === 'press' &&<PressAwardsPage onNavigate={navigate} />}
        </div>
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

// The CMS loads on demand, so public visitors never download it (or its DM Sans font)
const AdminApp = lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })));

const isAdminHash = () => /^#\/?admin(\/|$)/.test(window.location.hash);

export default function App() {
  // The CMS is its own shell: no site navbar, footer or smooth scrolling
  const [isAdmin, setIsAdmin] = useState(isAdminHash);

  useEffect(() => {
    const onHashChange = () => setIsAdmin(isAdminHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (isAdmin) return <Suspense fallback={null}><AdminApp /></Suspense>;

  return (
    <SmoothScrollProvider>
      <AppContent />
    </SmoothScrollProvider>
  );
}
