import React from 'react';
import { cn } from './cn';

export const CMS_ASSETS = {
  emblemSm: '/cms/emblem-sm.svg',
  avatar36: '/cms/avatar-36.svg',
  avatar32: '/cms/avatar-32.svg',
  browserDot: '/cms/browser-dot.svg',
  focalRing: '/cms/focal-ring.svg',
  focalDot: '/cms/focal-dot.svg',
  toggleOn: '/cms/toggle-on.svg',
  dotAccent6: '/cms/dot-accent-6.svg',
  dotAccent8: '/cms/dot-accent-8.svg',
  dotInk8: '/cms/dot-ink-8.svg',
};

/* ---------- Button ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, type = 'button', ...rest }) => (
  <button
    type={type}
    className={cn(
      'cms-nav inline-flex items-center justify-center whitespace-nowrap px-[18px] py-[11px] transition-colors',
      variant === 'primary' && 'bg-cms-ink text-white hover:bg-[#2a2a2a]',
      variant === 'secondary' && 'border border-cms-ink text-cms-ink py-[10px] hover:bg-cms-surface',
      variant === 'ghost' && 'text-cms-ink hover:bg-cms-surface',
      'disabled:opacity-40 disabled:pointer-events-none',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);

/* ---------- Status pill ---------- */

export type Status = 'Published' | 'Draft' | 'In review';

export const StatusPill: React.FC<{ status: Status }> = ({ status }) => {
  if (status === 'In review') {
    return (
      <span className="inline-flex shrink-0 items-center gap-[6px] rounded-full border border-cms-accent px-[10px] py-[4px] cms-caps text-cms-ink">
        <img src={CMS_ASSETS.dotAccent6} width={6} height={6} alt="" />
        In review
      </span>
    );
  }
  if (status === 'Draft') {
    return <span className="inline-flex shrink-0 items-center rounded-full border border-cms-line px-[10px] py-[4px] cms-caps text-cms-ink">Draft</span>;
  }
  return <span className="inline-flex shrink-0 items-center rounded-full bg-cms-ink px-[10px] py-[5px] cms-caps text-white">Published</span>;
};

/* ---------- Tag (square chip) ---------- */

export const Tag: React.FC<{ solid?: boolean; children: React.ReactNode }> = ({ solid, children }) => (
  <span
    className={cn(
      'inline-flex px-[8px] py-[3px] cms-caps',
      solid ? 'bg-cms-ink text-white' : 'border border-cms-line text-cms-muted py-[2px]',
    )}
  >
    {children}
  </span>
);

/* ---------- Toggle ---------- */

export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className="relative h-[22px] w-[40px] shrink-0"
  >
    {checked ? (
      <img src={CMS_ASSETS.toggleOn} width={40} height={22} alt="" className="block" />
    ) : (
      <span className="absolute inset-0 rounded-full bg-cms-line">
        <span className="absolute left-[3px] top-[3px] size-[16px] rounded-full bg-white" />
      </span>
    )}
  </button>
);

/* ---------- Field ---------- */

interface FieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  /** Renders a native select styled like the box */
  options?: string[];
  maxLength?: number;
  /** Show a "n / max" counter in the hint slot */
  counter?: { max: number; unit?: 'chars' | 'words' };
  className?: string;
  readOnly?: boolean;
}

export const Field: React.FC<FieldProps> = ({ label, hint, value, onChange, placeholder, multiline, rows = 3, options, counter, className, readOnly }) => {
  const id = React.useId();
  const count = counter
    ? counter.unit === 'words'
      ? (value.trim() ? value.trim().split(/\s+/).length : 0)
      : value.length
    : 0;
  const hintText = counter ? `${count} / ${counter.max}${counter.unit === 'words' ? ' words' : ''}` : hint;
  const over = counter ? count > counter.max : false;
  const box = 'w-full bg-white border border-cms-line px-[14px] py-[12px] cms-body text-cms-ink placeholder:text-cms-ink outline-none focus:border-cms-ink transition-colors';

  return (
    <div className={cn('flex min-w-0 flex-col gap-[8px]', className)}>
      <div className="flex items-start justify-between gap-3">
        <label htmlFor={id} className="cms-caps whitespace-nowrap text-cms-muted">{label}</label>
        {hintText && <span className={cn('cms-body whitespace-nowrap', over ? 'text-cms-accent' : 'text-cms-stone-3')}>{hintText}</span>}
      </div>
      {options ? (
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(box, 'appearance-none cursor-pointer pr-10')}
          >
            {options.map((o) => <option key={o}>{o}</option>)}
          </select>
          <span aria-hidden className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 cms-body text-transparent">
            {value}<span className="text-cms-ink"> ▾</span>
          </span>
        </div>
      ) : multiline ? (
        <textarea
          id={id}
          value={value}
          rows={rows}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(box, 'resize-y placeholder:text-cms-muted')}
        />
      ) : (
        <input
          id={id}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={box}
        />
      )}
    </div>
  );
};

/* ---------- Card / section header ---------- */

export const Card: React.FC<{ className?: string; children: React.ReactNode; as?: 'section' | 'div' }> = ({ className, children, as: Tag = 'section' }) => (
  <Tag className={cn('flex flex-col gap-[16px] border border-cms-line p-[20px]', className)}>{children}</Tag>
);

export const CardHeader: React.FC<{ title: string; meta?: React.ReactNode }> = ({ title, meta }) => (
  <div className="flex items-center justify-between gap-4">
    <h2 className="cms-nav text-cms-ink">{title}</h2>
    {meta && <span className="cms-caps text-cms-muted">{meta}</span>}
  </div>
);

/* ---------- Page header ---------- */

export const PageHeader: React.FC<{ title: string; subtitle: React.ReactNode; actions?: React.ReactNode }> = ({ title, subtitle, actions }) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div className="flex flex-col gap-[8px]">
      <h1 className="cms-display-s text-cms-ink">{title}</h1>
      <p className="cms-body text-cms-muted">{subtitle}</p>
    </div>
    {actions && <div className="flex flex-wrap items-start gap-[12px]">{actions}</div>}
  </div>
);

/* ---------- Tabs ---------- */

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; count: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex gap-[28px] overflow-x-auto border-b border-cms-line scrollbar-none">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              'cms-nav -mb-px shrink-0 whitespace-pre border-b-2 pb-[12px] transition-colors',
              active ? 'border-cms-ink text-cms-ink' : 'border-transparent text-cms-muted hover:text-cms-ink',
            )}
          >
            {`${t.label}  ${t.count}`}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Image tile with caption ---------- */

export const ImageTile: React.FC<{ src?: string; caption: string; className?: string; alt?: string; objectPosition?: string; children?: React.ReactNode }> = ({ src, caption, className, alt = '', objectPosition, children }) => (
  <div className={cn('relative flex w-full flex-col justify-end overflow-hidden bg-cms-stone-1 px-[16px] pb-[14px] pt-[16px]', className)}>
    {src && <img src={src} alt={alt} style={{ objectPosition }} className="pointer-events-none absolute inset-0 size-full object-cover" />}
    <p className={cn('relative cms-caps whitespace-nowrap', src ? 'text-white' : 'text-cms-muted')}>{caption}</p>
    {children}
  </div>
);

/* ---------- Drag handle glyph ---------- */

export const Grip: React.FC = () => <span aria-hidden className="cms-body shrink-0 cursor-grab text-cms-stone-3">⋮⋮</span>;

/* ---------- Inline select ("Immediately ▾") ---------- */

export const InlineSelect: React.FC<{ value: string; onChange: (v: string) => void; options: string[]; label: string }> = ({ value, onChange, options, label }) => (
  <span className="relative inline-flex cursor-pointer items-center">
    <span aria-hidden className="cms-body whitespace-nowrap">{value} ▾</span>
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </span>
);
