import { ASSETS } from '../constants/assets';
import type { Status } from './ui';

export type Role = 'Admin' | 'Editor' | 'Writer';

export interface CmsArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  status: Status;
  aeo: 'Ready' | 'No short answer' | 'No FAQ';
  updated: string;
}

export const ARTICLES: CmsArticle[] = [
  { id: 'eco-home-materials-wayanad', title: 'Eco-home materials you can source near Wayanad', category: 'Climate & materials', author: 'Studio Writer', status: 'In review', aeo: 'Ready', updated: 'Today' },
  { id: 'design-vs-built-commercial', title: 'Design vs built: the Commercial Space', category: 'Case studies', author: 'Studio Writer', status: 'Draft', aeo: 'No short answer', updated: 'Yesterday' },
  { id: 'house-cost-wayanad-2026', title: 'How much does it cost to build a house in Wayanad in 2026?', category: 'Costs & planning', author: 'Ar. Rashid Ali', status: 'Published', aeo: 'Ready', updated: '12 Oct' },
  { id: 'kerala-home-monsoon', title: 'Designing a Kerala home for the monsoon', category: 'Climate & materials', author: 'Ar. Rashid Ali', status: 'Published', aeo: 'Ready', updated: '28 Sep' },
  { id: 'kerala-building-permits', title: 'Building permits in Kerala, step by step', category: 'Permits', author: 'Studio Editor', status: 'Published', aeo: 'No FAQ', updated: '22 Aug' },
  { id: 'hill-slope-wayanad', title: 'Building on a hill slope in Wayanad', category: 'Costs & planning', author: 'Ar. Rashid Ali', status: 'Published', aeo: 'Ready', updated: '14 Jul' },
  { id: 'apartment-fit-out-bengaluru', title: 'What a full apartment fit-out costs in Bengaluru', category: 'Interiors', author: 'Studio Editor', status: 'Published', aeo: 'No FAQ', updated: '30 Jun' },
  { id: 'case-study-residence', title: 'Case study: the Residence', category: 'Case studies', author: 'Ar. Rashid Ali', status: 'Published', aeo: 'Ready', updated: '18 Apr' },
];

export const ARTICLE_CATEGORIES = ['Climate & materials', 'Case studies', 'Costs & planning', 'Permits', 'Interiors'];
export const AUTHORS = ['Ar. Rashid Ali', 'Studio Editor', 'Studio Writer'];

export interface CmsProject {
  id: string;
  name: string;
  meta: string;
  image?: string;
  onHomepage: boolean;
  images: number;
  missingAlt: number;
}

export const PROJECTS: CmsProject[] = [
  { id: 'residence', name: 'Residence', meta: 'Residential · Architecture', image: ASSETS.projectCloudHouse, onHomepage: true, images: 8, missingAlt: 0 },
  { id: 'commercial-space', name: 'Commercial Space', meta: 'Commercial · Architecture', onHomepage: true, images: 6, missingAlt: 0 },
  { id: 'apartments', name: 'Apartments', meta: 'Apartments · Architecture · Interiors', onHomepage: true, images: 10, missingAlt: 0 },
  { id: 'open-store', name: 'Open Store', meta: 'Retail · Interiors', onHomepage: true, images: 5, missingAlt: 0 },
  { id: 'living-space', name: 'Living Space', meta: 'Residential · Interiors', image: ASSETS.projectTerraVilla, onHomepage: false, images: 4, missingAlt: 0 },
  { id: 'chair-design', name: 'Chair Design', meta: 'Furniture · Product design', onHomepage: false, images: 3, missingAlt: 1 },
];

export interface TeamMember {
  name: string;
  email: string;
  role: Role;
  lastActive: string;
}

export const TEAM: TeamMember[] = [
  { name: 'Ar. Rashid Ali', email: 'hello@flowspacearchitects.com', role: 'Admin', lastActive: 'Now' },
  { name: 'Studio Editor', email: 'editor@flowspacearchitects.com', role: 'Editor', lastActive: 'Yesterday' },
  { name: 'Studio Writer', email: 'writer@flowspacearchitects.com', role: 'Writer', lastActive: '2 hours ago' },
];

export const PERMISSIONS = ['Write and edit drafts', 'Submit for review', 'Publish articles', 'Edit projects & homepage', 'Manage team & settings'] as const;

export const ROLES: { role: Role; blurb: string; can: boolean[] }[] = [
  { role: 'Admin', blurb: 'Full control of the site and team.', can: [true, true, true, true, true] },
  { role: 'Editor', blurb: 'Runs content day to day.', can: [true, true, true, true, false] },
  { role: 'Writer', blurb: 'Writes for the Journal.', can: [true, true, false, false, false] },
];
