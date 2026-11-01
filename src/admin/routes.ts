export type AdminSection = 'dashboard' | 'articles' | 'research' | 'projects' | 'homepage' | 'media' | 'team' | 'settings';

export interface AdminRoute {
  section: AdminSection;
  /** Second path segment: an article/project id for the editors */
  param?: string;
}

/** `#/admin/articles/edit` → { section: 'articles', param: 'edit' } */
export const parseAdminHash = (hash: string): AdminRoute => {
  const [, section, param] = hash.replace(/^#\/?/, '').split('/');
  const known: AdminSection[] = ['articles', 'research', 'projects', 'homepage', 'media', 'team', 'settings'];
  return known.includes(section as AdminSection) ? { section: section as AdminSection, param } : { section: 'dashboard' };
};

export const adminHref = (section: AdminSection, param?: string) =>
  `#/admin${section === 'dashboard' ? '' : `/${section}`}${param ? `/${param}` : ''}`;
