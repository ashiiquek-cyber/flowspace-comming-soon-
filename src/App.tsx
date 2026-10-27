import React, { useState, useEffect, useCallback } from 'react';
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
import { PressAwardsPage } from './pages/PressAwardsPage';
import { PROJECTS_DATA, type NavigateTarget, type Page } from './data/projects';

interface Route {
  page: Page;
  projectId?: string;
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
    case 'journal': return { page: 'journal' };
    case 'article': return { page: 'article' };
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
  press: 'Press and awards — Flowspace Architects',
};

function AppContent() {
  const [route, setRoute] = useState<Route>(parseHash);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // On every route: reset scroll, retitle, recompute triggers, then jump to a section if asked
  useEffect(() => {
    const project = route.projectId ? PROJECTS_DATA.find((p) => p.id === route.projectId) : undefined;
    document.title = project ? `${project.title} — Flowspace Architects` : TITLES[route.page];
    scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (route.section) {
        const el = document.getElementById(route.section);
        if (el) scrollTo(el, { offset: -80 });
      }
    }, 60);
    return () => window.clearTimeout(id);
  }, [route, scrollTo]);

  const navigate = useCallback((target: NavigateTarget) => {
    const hash = target === 'home' ? '/' : target === 'project-detail' ? `/project/${PROJECTS_DATA[0].id}` : `/${target}`;
    if (window.location.hash === `#${hash}`) setRoute(parseHash());
    else window.location.hash = hash;
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
        {page === 'journal' && <JournalPage onNavigate={navigate} />}
        {page === 'article' && <ArticlePage onNavigate={navigate} />}
        {page === 'press' && <PressAwardsPage onNavigate={navigate} />}
        </div>
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <AppContent />
    </SmoothScrollProvider>
  );
}
