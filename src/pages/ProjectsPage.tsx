import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { LagItem } from '../components/ParallaxLag';

interface ProjectsPageProps {
  onNavigate: (page: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press') => void;
  onSelectProject?: (projectId: string) => void;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Apartments' | 'Interiors' | 'Furniture';
  location: string;
  year: string;
  discipline: string;
  area: string;
  status: string;
  image: string;
  description: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'cloud-house',
    title: 'The Cloud House',
    category: 'Residential',
    location: 'Kalpetta, Wayanad',
    year: '2024',
    discipline: 'Architecture · Landscape',
    area: '4,800 sq.ft',
    status: 'Completed',
    image: ASSETS.projectCloudHouse,
    description: 'A hillside family sanctuary embedded into the slope, responding to the Wayanad mist and monsoon.'
  },
  {
    id: 'terra-villa',
    title: 'Terra Villa',
    category: 'Residential',
    location: 'Jayanagar, Bengaluru',
    year: '2025',
    discipline: 'Architecture · Interiors',
    area: '3,600 sq.ft',
    status: 'Completed',
    image: ASSETS.projectTerraVilla,
    description: 'An inward-looking courtyard residence created with exposed terracotta and handcrafted teak.'
  },
  {
    id: 'courtyard-studio',
    title: 'The Courtyard Studio',
    category: 'Commercial',
    location: 'Kalpetta, Wayanad',
    year: '2026',
    discipline: 'Architecture · Adaptive Reuse',
    area: '5,200 sq.ft',
    status: 'Completed',
    image: ASSETS.projectHover,
    description: 'A sustainable creative workspace blending raw concrete, recycled timber, and open courtyards.'
  },
  {
    id: 'glass-pavilion',
    title: 'The Ridge Pavilion',
    category: 'Residential',
    location: 'Vythiri, Kerala',
    year: '2024',
    discipline: 'Architecture · Interiors',
    area: '3,900 sq.ft',
    status: 'Completed',
    image: ASSETS.heroBg,
    description: 'Lightweight steel and glass residence cantilevered over a tea plantation ridge.'
  },
  {
    id: 'atelier-jayanagar',
    title: 'Atelier Jayanagar',
    category: 'Interiors',
    location: 'Bengaluru, Karnataka',
    year: '2025',
    discipline: 'Interior Architecture · Retail',
    area: '2,400 sq.ft',
    status: 'Completed',
    image: ASSETS.projectTerraVilla,
    description: 'A minimalist design showroom featuring custom brass joinery and lime plaster walls.'
  },
  {
    id: 'teak-monolith',
    title: 'The Teak Lounger',
    category: 'Furniture',
    location: 'Wayanad Workshop',
    year: '2026',
    discipline: 'Product Design',
    area: 'Bespoke',
    status: 'Produced',
    image: ASSETS.projectCloudHouse,
    description: 'Sculptural lounge chair crafted from salvaged Kerala plantation teak with zero-fastener joinery.'
  }
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate, onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'index'>('grid');

  const categories = ['All', 'Residential', 'Commercial', 'Apartments', 'Interiors', 'Furniture'] as const;

  const filteredProjects = activeFilter === 'All' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === activeFilter);

  const handleOpenDetail = (id: string) => {
    if (onSelectProject) onSelectProject(id);
    onNavigate('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-ink flex flex-col items-start w-full relative">
      {/* 1. HEADER SECTION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10">
          <div className="flex items-start gap-4">
            <h1 className="font-dm-sans font-medium text-6xl sm:text-8xl md:text-[140px] lg:text-[180px] leading-[0.86] tracking-[-4px] sm:tracking-[-8px] lg:tracking-[-12px] text-ink">
              Projects
            </h1>
            <span className="text-[13px] uppercase tracking-[0.48px] text-ink-muted font-medium pt-3">
              (0{filteredProjects.length})
            </span>
          </div>

          <p className="font-normal text-lg sm:text-[22px] leading-[1.4] text-ink tracking-[-0.22px] max-w-[460px]">
            Homes, apartments, commercial spaces, interiors and furniture — designed in Kerala and Karnataka.
          </p>
        </div>
      </section>

      {/* 2. FILTERS & VIEW MODE BAR */}
      <section className="w-full border-y border-line sticky top-[81px] bg-white/95 backdrop-blur-md z-30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-ink text-white shadow-sm'
                      : 'border border-line text-ink hover:border-ink bg-transparent'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Grid vs Index */}
          <div className="flex items-center gap-6 text-[15px] font-medium tracking-tight self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('index')}
              className={`cursor-pointer transition-colors ${
                viewMode === 'index' ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Index
            </button>
          </div>
        </div>
      </section>

      {/* 3. CONTENT AREA */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 items-start">
            {filteredProjects.map((project, idx) => {
              // Differential column lag: column 0 goes normal, column 1 lags behind, column 2 has intermediate float
              const cardLag = (idx % 3 === 1) ? 0.16 : (idx % 3 === 2) ? 0.08 : 0;
              return (
                <LagItem
                  key={project.id}
                  lag={cardLag}
                  inertia={cardLag > 0}
                  wrapperClassName="h-full"
                >
                  <div
                    onClick={() => handleOpenDetail(project.id)}
                    className="group flex flex-col gap-5 cursor-pointer"
                  >
                    {/* Image Container with Curtain Hover Effect */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface rounded-[2px]">
                      <img
                        alt={project.title}
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        src={project.image}
                      />
                      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-300" />
                      
                      {/* Floating View Badge on Hover */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-ink text-[12px] font-medium shadow-md">
                          View ↗
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
                        <span>{project.location}</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="font-dm-sans font-medium text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-[14px] text-ink-muted font-light">
                        {project.discipline}
                      </p>
                    </div>
                  </div>
                </LagItem>
              );
            })}
          </div>
        ) : (
          /* INDEX VIEW (TABULAR) */
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium pb-4">
                  <th className="py-4 font-medium">Project</th>
                  <th className="py-4 font-medium">Location</th>
                  <th className="py-4 font-medium">Category</th>
                  <th className="py-4 font-medium">Discipline</th>
                  <th className="py-4 font-medium">Year</th>
                  <th className="py-4 font-medium">Status</th>
                  <th className="py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => handleOpenDetail(project.id)}
                    className="group hover:bg-surface transition-colors cursor-pointer"
                  >
                    <td className="py-5 font-medium text-[16px] text-ink group-hover:text-accent transition-colors">
                      {project.title}
                    </td>
                    <td className="py-5 text-[15px] text-ink-muted">
                      {project.location}
                    </td>
                    <td className="py-5 text-[15px] text-ink-muted">
                      {project.category}
                    </td>
                    <td className="py-5 text-[15px] text-ink-muted">
                      {project.discipline}
                    </td>
                    <td className="py-5 text-[15px] text-ink-muted">
                      {project.year}
                    </td>
                    <td className="py-5 text-[14px]">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-stone-1 text-ink-muted text-[12px]">
                        {project.status}
                      </span>
                    </td>
                    <td className="py-5 text-right font-medium text-ink group-hover:text-accent transition-colors">
                      View ↗
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
