import { ASSETS } from '../constants/assets';

export type ResearchType = 'Paper' | 'Study';

export interface ResearchItem {
  id: string;
  type: ResearchType;
  title: string;
  year: string;
  /** Publisher or journal for papers; the setting for studies */
  venue: string;
  summary: string;
  findings?: string[];
  image: string;
  /** Link or PDF, once the real document exists */
  href?: string;
}

// Placeholder entries: replace with the studio's published work
export const RESEARCH_DATA: ResearchItem[] = [
  {
    id: 'courtyard-thermal-chimney',
    type: 'Study',
    title: 'Courtyards as thermal chimneys in the Wayanad highlands',
    year: '2026',
    venue: 'Flowspace field study, Wayanad',
    summary: 'Twelve months of temperature and airflow logging across four courtyard homes, measuring how an open centre pulls cool mountain air through living spaces.',
    findings: ['Interior peaks ran 4–6°C below ambient in the dry season', 'Deep canopies cut driven-rain ingress by roughly half'],
    image: ASSETS.projectHover,
  },
  {
    id: 'rammed-earth-monsoon',
    type: 'Paper',
    title: 'Rammed earth and the monsoon: stabilisation without cement',
    year: '2025',
    venue: 'Journal of Tropical Architecture (placeholder)',
    summary: 'A comparison of lime and laterite stabilisers for load-bearing rammed earth walls exposed to Kerala’s heavy seasonal rainfall.',
    findings: ['Lime-stabilised mixes held up best under repeated wetting', 'Plinth height mattered more than wall thickness'],
    image: ASSETS.projectTerraVilla,
  },
  {
    id: 'nadumuttam-reinterpreted',
    type: 'Paper',
    title: 'The nadumuttam reinterpreted for dense urban plots',
    year: '2024',
    venue: 'Indian Institute of Architects symposium (placeholder)',
    summary: 'How the traditional Kerala inner courtyard can be compressed into narrow Bengaluru plots while keeping light, ventilation and privacy.',
    image: ASSETS.projectInterior,
  },
  {
    id: 'passive-cooling-roofs',
    type: 'Study',
    title: 'Passive cooling through deep roof canopies',
    year: '2024',
    venue: 'Flowspace studio research',
    summary: 'Sun-path modelling and on-site measurement of overhang depth against glazing orientation for homes without air conditioning.',
    findings: ['A 1.2 m canopy removed most summer solar gain on west glazing'],
    image: ASSETS.projectCloudHouse,
  },
];
