import React, { useState, useEffect } from 'react';
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

type Page = 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'projects') return 'projects';
    if (hash === 'project-detail') return 'project-detail';
    if (hash === 'studio' || hash === 'about' || hash === 'contact') return 'studio';
    if (hash === 'journal') return 'journal';
    if (hash === 'article') return 'article';
    if (hash === 'press' || hash === 'awards') return 'press';
    return 'home';
  });

  const { isScrolled, scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'projects') setCurrentPage('projects');
      else if (hash === 'project-detail') setCurrentPage('project-detail');
      else if (hash === 'studio' || hash === 'about' || hash === 'contact') setCurrentPage('studio');
      else if (hash === 'journal') setCurrentPage('journal');
      else if (hash === 'article') setCurrentPage('article');
      else if (hash === 'press' || hash === 'awards') setCurrentPage('press');
      else setCurrentPage('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = `/${page === 'home' ? '' : page}`;
    scrollTo(0, { immediate: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink font-sans antialiased selection:bg-accent selection:text-white">
      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        variant={currentPage === 'home' && !isScrolled ? 'transparent' : 'solid'}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
        {currentPage === 'project-detail' && <ProjectDetailPage onNavigate={handleNavigate} />}
        {currentPage === 'studio' && <AboutContactPage onNavigate={handleNavigate} />}
        {currentPage === 'journal' && <JournalPage onNavigate={handleNavigate} />}
        {currentPage === 'article' && <ArticlePage onNavigate={handleNavigate} />}
        {currentPage === 'press' && <PressAwardsPage onNavigate={handleNavigate} />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
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
