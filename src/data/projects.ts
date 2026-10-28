import { ASSETS } from '../constants/assets';

export type Page = 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press';
export type NavigateTarget = Page | 'contact';

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
  /** object-position for the cover crop */
  focus?: string;
  description: string;
  client?: string;
  lead?: string;
  overview?: string[];
  challenge?: { title: string; body: string };
  solution?: { title: string; body: string };
  gallery?: { src: string; caption: string }[];
  comparison?: { design: string; built: string };
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'cloud-house',
    title: 'The Cloud House',
    category: 'Residential',
    location: 'Kalpetta, Wayanad',
    year: '2024',
    discipline: 'Architecture and landscape',
    area: '4,800 sq.ft',
    status: 'Completed',
    image: ASSETS.projectCloudHouse,
    focus: '50% 60%',
    description: 'A hillside family sanctuary embedded into the slope, responding to the Wayanad mist and monsoon.',
    client: 'Private client',
    lead: 'A hillside family sanctuary shaped by the slopes, mist, and monsoon of the Western Ghats.',
    overview: [
      'The site is a steep contour in Kalpetta, blessed with dense vegetation and panoramic views toward the Chembra peak. Rather than flattening the terrain with massive retaining walls, the residence steps down naturally through three terraced levels.',
      'Utilizing locally quarried laterite stone, reclaimed timber screens, and deeply cantilevered clay-tiled overhangs, the architecture establishes a perpetual dialogue between sheltered internal spaces and the lush, rain-washed landscape outside.',
    ],
    challenge: {
      title: 'A 40-degree gradient facing 3,000mm of annual rainfall',
      body: 'Managing torrential tropical monsoon water flow while preserving mature jackfruit and teak trees on the slope. The home needed to stay completely dry during months of non-stop monsoon downpours while avoiding mechanical air conditioning.',
    },
    solution: {
      title: 'Cantilevered pavilions and passive courtyard wind towers',
      body: 'We engineered deep roof canopies that deflect heavy wind-driven rain into sub-surface rainwater harvesting swales. A central open courtyard acts as a thermal chimney, drawing cool mountain air continuously through all bedrooms and living pavilions.',
    },
    gallery: [
      { src: ASSETS.projectHover, caption: 'Courtyard, design visualisation' },
      { src: ASSETS.projectTerraVilla, caption: 'Living pavilion, design visualisation' },
    ],
    comparison: { design: ASSETS.heroBg, built: ASSETS.projectCloudHouse },
  },
  {
    id: 'terra-villa',
    title: 'Terra Villa',
    category: 'Residential',
    location: 'Jayanagar, Bengaluru',
    year: '2025',
    discipline: 'Architecture and interiors',
    area: '3,600 sq.ft',
    status: 'Completed',
    image: ASSETS.projectTerraVilla,
    description: 'An inward-looking courtyard residence created with exposed terracotta and handcrafted teak.',
    client: 'Private client',
    lead: 'An urban courtyard home that balances high-density living with private internal gardens.',
    overview: [
      'On a tight Jayanagar plot, the house turns inward: rooms gather around a planted court that brings light and air into the deepest parts of the plan.',
      'Exposed terracotta, handcrafted teak and lime-washed walls keep the interior calm and cool through Bengaluru’s dry summers.',
    ],
    gallery: [
      { src: ASSETS.projectInterior, caption: 'Kitchen, design visualisation' },
      { src: ASSETS.founderPhoto, caption: 'Bedroom suite, design visualisation' },
    ],
  },
  {
    id: 'courtyard-studio',
    title: 'The Courtyard Studio',
    category: 'Commercial',
    location: 'Kalpetta, Wayanad',
    year: '2026',
    discipline: 'Architecture and adaptive reuse',
    area: '5,200 sq.ft',
    status: 'Completed',
    image: ASSETS.projectHover,
    description: 'A sustainable creative workspace blending raw concrete, recycled timber, and open courtyards.',
    client: 'Private client',
    lead: 'An adaptive reuse workspace that blends industrial timber trusses with rammed earth walls.',
    overview: [
      'An existing shed was opened up around a glazed, planted courtyard. Timber trusses were kept and repaired; new rammed earth walls carry thermal mass where the old structure was weakest.',
    ],
    gallery: [
      { src: ASSETS.heroBg, caption: 'Double-height studio, design visualisation' },
      { src: ASSETS.projectCloudHouse, caption: 'Street elevation, design visualisation' },
    ],
  },
  {
    id: 'glass-pavilion',
    title: 'The Ridge Pavilion',
    category: 'Residential',
    location: 'Vythiri, Kerala',
    year: '2024',
    discipline: 'Architecture and interiors',
    area: '3,900 sq.ft',
    status: 'Completed',
    image: ASSETS.heroBg,
    description: 'Lightweight steel and glass residence cantilevered over a tea plantation ridge.',
    client: 'Private client',
  },
  {
    id: 'atelier-jayanagar',
    title: 'Atelier Jayanagar',
    category: 'Interiors',
    location: 'Bengaluru, Karnataka',
    year: '2025',
    discipline: 'Interior architecture and retail',
    area: '2,400 sq.ft',
    status: 'Completed',
    image: ASSETS.projectInterior,
    description: 'A minimalist design showroom featuring custom brass joinery and lime plaster walls.',
    client: 'Private client',
  },
  {
    id: 'teak-monolith',
    title: 'The Teak Lounger',
    category: 'Furniture',
    location: 'Wayanad workshop',
    year: '2026',
    discipline: 'Product design',
    area: 'Bespoke',
    status: 'Produced',
    image: ASSETS.projectTerraVilla,
    focus: '20% 80%',
    description: 'Sculptural lounge chair crafted from salvaged Kerala plantation teak with zero-fastener joinery.',
    client: 'Studio edition',
  },
];

export const getProject = (id?: string | null) =>
  PROJECTS_DATA.find((p) => p.id === id) ?? PROJECTS_DATA[0];

export const getNextProject = (id: string) => {
  const i = PROJECTS_DATA.findIndex((p) => p.id === id);
  return PROJECTS_DATA[(i + 1) % PROJECTS_DATA.length];
};
