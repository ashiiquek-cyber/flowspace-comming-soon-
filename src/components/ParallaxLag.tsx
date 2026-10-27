import React, { useEffect, useRef, useId } from 'react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

export interface LagItemProps extends React.HTMLAttributes<HTMLDivElement> {
  lag?: number; // 0 = standard speed ("goes"), >0 = lags behind ("lag"), <0 = leads ahead
  inertia?: boolean; // reacts dynamically to scroll velocity with physical mass
  direction?: 'y' | 'x';
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * LagItem creates differential scroll velocity.
 * When lag > 0: the inner element moves slower than the surrounding page ("some section lag").
 * When lag === 0: scrolls at exact 1:1 natural speed ("some goes").
 * When lag < 0: floats slightly faster than the surrounding page.
 */
export const LagItem: React.FC<LagItemProps> = ({
  lag = 0.15,
  inertia = false,
  direction = 'y',
  className = '',
  wrapperClassName = '',
  wrapperStyle,
  style,
  children,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { registerLagElement, unregisterLagElement, lagMode } = useSmoothScroll();
  const autoId = useId();

  useEffect(() => {
    if (lag === 0 || !containerRef.current || !targetRef.current) return;

    const id = `lag-item-${autoId}`;
    registerLagElement({
      id,
      container: containerRef.current,
      target: targetRef.current,
      lagFactor: lag,
      withInertia: inertia,
      direction,
    });

    return () => {
      unregisterLagElement(id);
    };
  }, [autoId, lag, inertia, direction, registerLagElement, unregisterLagElement]);

  // If lag is 0, we can render directly without inner wrapper
  if (lag === 0) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${wrapperClassName}`}
      style={wrapperStyle}
      {...rest}
    >
      <div
        ref={targetRef}
        className={`w-full will-change-transform ${className}`}
        style={{
          ...style,
          transition: lagMode === 'off' ? 'transform 0.3s ease-out' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * LagColumn: Specifically designed for multi-column grids
 * where one column moves at standard speed ("goes") and the companion column lags behind ("lags").
 */
export interface LagColumnProps {
  lag?: number;
  className?: string;
  children: React.ReactNode;
}

export const LagColumn: React.FC<LagColumnProps> = ({ lag = 0.16, className = '', children }) => {
  return (
    <LagItem lag={lag} inertia className={className} wrapperClassName="h-full">
      {children}
    </LagItem>
  );
};
