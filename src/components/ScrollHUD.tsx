import React, { useState } from 'react';
import { useSmoothScroll, LagMode } from '../context/SmoothScrollContext';
import { SlidersHorizontal, ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';

export const ScrollHUD: React.FC = () => {
  const { lagMode, setLagMode, velocity, scroll } = useSmoothScroll();
  const [isExpanded, setIsExpanded] = useState(false);

  // Speed magnitude normalized (0 to 100)
  const speedMagnitude = Math.min(Math.round(Math.abs(velocity) * 4), 100);
  const isScrolling = Math.abs(velocity) > 0.05;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans print:hidden">
      {/* Expanded Control Box */}
      {isExpanded ? (
        <div className="bg-white/95 backdrop-blur-lg border border-ink/15 rounded-xl shadow-2xl p-4 w-72 text-ink transition-all duration-300 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[12px] font-medium tracking-[0.48px] uppercase text-ink">
                Lag Scroll Physics
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-ink-muted hover:text-ink p-1 rounded transition-colors"
              aria-label="Collapse scroll panel"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[12px] text-ink-muted leading-relaxed mb-3.5">
            Differential inertia: some sections and cards lag behind while others move at standard speed to create depth.
          </p>

          {/* Mode Switcher */}
          <div className="flex flex-col gap-1.5 mb-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.3px] text-ink-muted">
              Intensity
            </span>
            <div className="grid grid-cols-3 gap-1 bg-surface p-1 rounded-lg border border-line/60">
              {(['expressive', 'subtle', 'off'] as LagMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLagMode(mode)}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded capitalize transition-all ${
                    lagMode === mode
                      ? 'bg-ink text-white shadow-sm'
                      : 'text-ink hover:text-accent hover:bg-white/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Live Telemetry */}
          <div className="bg-stone-1 rounded-lg p-2.5 border border-line/50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-ink-muted">Scroll Momentum</span>
              <span className="font-mono text-ink font-medium">
                {isScrolling ? `${Math.abs(velocity).toFixed(1)} px/f` : 'Idle'}
              </span>
            </div>

            {/* Velocity Bar */}
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-75 ease-out rounded-full"
                style={{ width: `${speedMagnitude}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-ink-muted pt-1 border-t border-line/40">
              <span>Scroll Y: {Math.round(scroll)}px</span>
              <span className="capitalize text-accent font-medium">{lagMode} Lag</span>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Floating Pill */
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-2.5 bg-white/90 hover:bg-white backdrop-blur-md border border-ink/15 hover:border-ink/30 px-3.5 py-2 rounded-full shadow-lg hover:shadow-xl text-ink transition-all duration-200"
        >
          <span
            className={`size-2 rounded-full ${
              lagMode === 'off'
                ? 'bg-ink-muted'
                : isScrolling
                ? 'bg-accent scale-125'
                : 'bg-accent'
            } transition-all`}
          />

          <span className="text-[12px] font-medium tracking-[0.24px] uppercase flex items-center gap-1.5">
            <span>Lag Scroll</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-1 text-ink-muted font-normal capitalize">
              {lagMode}
            </span>
          </span>

          <SlidersHorizontal className="size-3.5 text-ink-muted group-hover:text-ink transition-colors ml-0.5" />
        </button>
      )}
    </div>
  );
};
