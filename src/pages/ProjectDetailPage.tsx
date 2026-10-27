import React, { useState, useRef, useCallback } from 'react';
import { ASSETS } from '../constants/assets';

interface ProjectDetailPageProps {
  onNavigate: (page: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press') => void;
  projectId?: string;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ onNavigate }) => {
  // Interactive Design vs Built slider position (percentage 0 - 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const isDraggingRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPosition(clampedPercentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      className="bg-white text-ink flex flex-col items-start w-full relative"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 1. TOP BREADCRUMB & HEADER */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-8">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('projects')}
          className="group inline-flex items-center gap-2 text-[15px] font-medium text-ink-muted hover:text-ink transition-colors mb-8 cursor-pointer"
        >
          <span>←</span>
          <span>Projects / Residential</span>
        </button>

        {/* Project Title */}
        <h1 className="font-dm-sans font-medium text-5xl sm:text-7xl md:text-9xl tracking-[-3px] md:tracking-[-6px] text-ink mb-12">
          The Cloud House
        </h1>

        {/* Specifications Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 border-t border-ink">
          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
              Location
            </p>
            <p className="text-[16px] font-medium text-ink">
              Kalpetta, Wayanad
            </p>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
              Year
            </p>
            <p className="text-[16px] font-medium text-ink">
              2024
            </p>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
              Client
            </p>
            <p className="text-[16px] font-medium text-ink">
              Private client
            </p>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
              Area
            </p>
            <p className="text-[16px] font-medium text-ink">
              4,800 sq.ft
            </p>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
              Status
            </p>
            <p className="text-[16px] font-medium text-ink">
              Completed
            </p>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
              Scope
            </p>
            <p className="text-[16px] font-medium text-ink">
              Architecture + Landscape
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN HERO PHOTOGRAPHY */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-20 md:pb-32">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-surface rounded-[2px]">
          <img
            alt="The Cloud House Exterior"
            className="size-full object-cover"
            src={ASSETS.projectCloudHouse}
          />
        </div>
        <p className="text-[13px] text-ink-muted mt-3">
          Exterior — design visualisation and site integration
        </p>
      </section>

      {/* 3. EDITORIAL OVERVIEW */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-ink pt-8">
          <div className="lg:col-span-4">
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
              (Overview)
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="font-dm-sans font-medium text-2xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-ink">
              A hillside family sanctuary shaped by the slopes, mist, and monsoon of the Western Ghats.
            </h2>
            <p className="text-lg md:text-[20px] text-ink-muted leading-relaxed font-light">
              The site is a steep contour in Kalpetta, blessed with dense vegetation and panoramic views toward the Chembra peak. Rather than flattening the terrain with massive retaining walls, the residence steps down naturally through three terraced levels.
            </p>
            <p className="text-lg md:text-[20px] text-ink-muted leading-relaxed font-light">
              Utilizing locally quarried laterite stone, reclaimed timber screens, and deeply cantilevered clay-tiled overhangs, the architecture establishes a perpetual dialogue between sheltered internal spaces and the lush, rain-washed landscape outside.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE CHALLENGE & THE SOLUTION SPLIT */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-24 md:pb-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-line pt-12">
          {/* The Challenge */}
          <div className="flex flex-col gap-4">
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
              (The challenge)
            </p>
            <h3 className="font-dm-sans font-medium text-2xl sm:text-3xl tracking-tight text-ink">
              A 40-degree gradient facing 3,000mm of annual rainfall
            </h3>
            <p className="text-[16px] text-ink-muted leading-relaxed">
              Managing torrential tropical monsoon water flow while preserving mature jackfruit and teak trees on the slope. The home needed to stay completely dry during months of non-stop monsoon downpours while avoiding mechanical air conditioning.
            </p>
          </div>

          {/* The Solution */}
          <div className="flex flex-col gap-4">
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
              (The solution)
            </p>
            <h3 className="font-dm-sans font-medium text-2xl sm:text-3xl tracking-tight text-ink">
              Cantilevered pavilions and passive courtyard wind towers
            </h3>
            <p className="text-[16px] text-ink-muted leading-relaxed">
              We engineered deep roof canopies that deflect heavy wind-driven rain into sub-surface rainwater harvesting swales. A central open courtyard acts as a thermal chimney, drawing cool mountain air continuously through all bedrooms and living pavilions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. IMAGE PAIR GALLERY */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-24 md:pb-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface rounded-[2px]">
              <img
                alt="Courtyard"
                className="size-full object-cover"
                src={ASSETS.projectHover}
              />
            </div>
            <p className="text-[13px] text-ink-muted mt-3">
              Courtyard — design visualisation
            </p>
          </div>

          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface rounded-[2px]">
              <img
                alt="Bedroom"
                className="size-full object-cover"
                src={ASSETS.projectTerraVilla}
              />
            </div>
            <p className="text-[13px] text-ink-muted mt-3">
              Bedroom & Veranda — design visualisation
            </p>
          </div>
        </div>
      </section>

      {/* 6. DESIGN VS BUILT INTERACTIVE COMPARISON SLIDER */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="border-t border-ink pt-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-dm-sans font-medium text-3xl sm:text-4xl text-ink tracking-tight">
                Design vs built
              </h2>
              <p className="text-[13px] text-ink-muted mt-1">
                The same view as designed in 3D and as completed on site.
              </p>
            </div>
            <span className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
              (Drag slider to compare)
            </span>
          </div>

          {/* Comparison Container */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[4px] cursor-ew-resize select-none comparison-container"
          >
            {/* Background Image: Built Photo */}
            <img
              alt="Built photography"
              className="absolute inset-0 size-full object-cover pointer-events-none"
              src={ASSETS.projectCloudHouse}
            />
            <div className="absolute top-6 right-6 z-10 px-3 py-1 bg-ink/75 backdrop-blur-sm text-white text-[12px] font-medium uppercase tracking-wider rounded">
              Built — Photo
            </div>

            {/* Foreground Image: Design Visualisation (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                alt="Design 3D Visualisation"
                className="absolute inset-0 max-w-none h-full object-cover"
                style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%' }}
                src={ASSETS.heroBg}
              />
              <div className="absolute top-6 left-6 z-10 px-3 py-1 bg-ink/75 backdrop-blur-sm text-white text-[12px] font-medium uppercase tracking-wider rounded">
                Design — 3D Visualisation
              </div>
            </div>

            {/* Drag Handle Bar */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-20 shadow-xl"
              style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
              <div className="size-10 rounded-full bg-white text-ink shadow-2xl flex items-center justify-center text-[12px] font-bold border border-ink/20">
                ↔
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ARCHITECT STATEMENT QUOTE */}
      <section className="w-full bg-surface py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-[960px] mx-auto text-center flex flex-col items-center gap-6">
          <blockquote className="font-dm-sans font-medium text-3xl sm:text-5xl leading-snug tracking-[-1.5px] text-ink">
            “A space should speak for itself — without any description.”
          </blockquote>
          <p className="text-[15px] uppercase tracking-[0.48px] text-ink-muted font-medium">
            Ar. Rashid Ali · Chief Architect
          </p>
        </div>
      </section>

      {/* 8. NEXT PROJECT NAVIGATION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="border-t border-ink pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group cursor-pointer"
        >
          <div>
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-2">
              Next project
            </p>
            <h3 className="font-dm-sans font-medium text-4xl sm:text-6xl text-ink tracking-tight group-hover:text-accent transition-colors">
              Terra Villa →
            </h3>
          </div>
          <span className="text-[16px] text-ink-muted">
            Jayanagar, Bengaluru · 2025
          </span>
        </div>
      </section>
    </div>
  );
};
