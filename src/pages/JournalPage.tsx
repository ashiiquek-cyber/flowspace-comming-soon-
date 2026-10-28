import React, { useState, useMemo } from 'react';
import type { NavigateTarget } from "../data/projects";
import { ASSETS } from '../constants/assets';
import { X, Send, CheckCircle2, ChevronRight } from 'lucide-react';

interface JournalPageProps {
  onNavigate: (target: NavigateTarget) => void;
}

type Category =
  | 'All'
  | 'Costs & planning'
  | 'Climate & materials'
  | 'Permits'
  | 'Interiors'
  | 'Case studies';

interface Article {
  id: string;
  category: Category;
  meta: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image?: string;
  imageTag?: string;
  isCoverPlaceholder?: boolean;
  content: {
    lead: string;
    sections: {
      heading: string;
      paragraphs: string[];
      highlight?: string;
    }[];
  };
}

const ARTICLES_DATA: Article[] = [
  {
    id: 'wayanad-cost-2026',
    category: 'Costs & planning',
    meta: 'Costs & planning — Oct 2026',
    title: 'How much does it cost to build a house in Wayanad in 2026?',
    excerpt: 'A clear breakdown by quality level, what pushes the price up, and where it is worth spending.',
    readTime: '8 min read',
    date: '12 Oct 2026',
    author: {
      name: 'Ar. Rashid Ali',
      role: 'Founder & Chief Architect',
      avatar: ASSETS.authorAvatar,
    },
    image: ASSETS.projectCloudHouse,
    imageTag: 'Design visualisation',
    content: {
      lead: 'Building in Wayanad is fundamentally different from building on the plains of Ernakulam or the plotted layouts of Bengaluru. The slope of the plot, rainfall intensity exceeding 3,000mm annually, transport of materials up the ghats, and structural soil conditions dictate construction budgets more than surface finishes.',
      sections: [
        {
          heading: 'Current Cost Per Square Foot (2026 Benchmarks)',
          paragraphs: [
            'For a well-detailed architect-designed home in Wayanad, current turnkey costs split into three clear tiers:',
            'Standard Quality (₹2,600 – ₹3,100 / sq.ft): Standard RCC frame, wire-cut brick or hollow concrete blocks, UPVC windows, vitrified tile flooring, and standard plumbing fixtures.',
            'Architectural & Climate-Responsive (₹3,400 – ₹4,200 / sq.ft): Exposed laterite stone, terracotta roof tiles over steel truss or RCC slab, local teak or seasoned hard timber, Kota stone / Athangudi tiles, double-height passive ventilation vents, and extensive rain-harvesting gutters.',
            'High-Craft & Hillside Custom (₹4,500 – ₹6,000+ / sq.ft): Stepped foundation systems on steep contours, cantilevered decks, imported thermal performance glass, custom timber joinery, integrated interior cabinetry, and landscape water management.',
          ],
          highlight: 'Site contour and soil retaining structures can add 12% to 22% to foundation costs before the ground floor plinth is even laid.',
        },
        {
          heading: 'Where the Budget Goes: What Pushes Cost Up',
          paragraphs: [
            '1. Ghat Road Logistics: Quarried stone, cement, and structural steel incur an 8% to 15% freight surcharge as they move up Thamarassery or Kuttiyadi ghat passes.',
            '2. Moisture Protection & Waterproofing: Skimping on waterproofing in Wayanad leads to immediate distress. We specify multi-layer crystalline damp-proofing and continuous roof eaves with at least 900mm projection.',
            '3. Slope Retention: Plots sloping above 1:4 require engineering retaining walls, weepholes, and subsurface French drains.',
          ],
        },
        {
          heading: 'Where It Pays to Spend vs. Save',
          paragraphs: [
            'Invest unconditionally in roof overhangs, rainwater drainage, and foundation moisture barriers. These cannot be retrofitted without disproportionate expense.',
            'Save strategically on wall finishes: exposed structural brickwork and authentic lime plaster eliminate recurring paint maintenance while giving the home natural thermal breathability.',
          ],
        },
      ],
    },
  },
  {
    id: 'kerala-monsoon-design',
    category: 'Climate & materials',
    meta: 'Climate & materials — Sep 2026',
    title: 'Designing a Kerala home for the monsoon',
    excerpt: 'Roof pitch, deep overhangs and cross-ventilation — the decisions that keep a house dry and cool.',
    readTime: '6 min read',
    date: '28 Sep 2026',
    author: {
      name: 'Ar. Rashid Ali',
      role: 'Founder & Chief Architect',
      avatar: ASSETS.authorAvatar,
    },
    image: ASSETS.projectHover,
    imageTag: 'Design visualisation',
    content: {
      lead: 'Kerala’s architecture was historically designed around water: how to capture summer breezes while shielding living quarters from torrential southwest monsoon downpours. Modern concrete flat-roof boxes often turn into damp thermal traps without proper climate adjustments.',
      sections: [
        {
          heading: 'Roof Pitch and Overhang Geometry',
          paragraphs: [
            'A minimum roof pitch of 30 to 35 degrees allows rain to shed instantaneously, preventing leaf debris accumulation and stagnant pooling.',
            'Deep overhangs (eaves of 900mm to 1200mm) shade external walls from horizontal rain driving at 40 km/h, keeping plaster dry and preventing moss buildup.',
          ],
          highlight: 'Verandas (nadumuttam & verandah) act as thermal and water buffers between the exterior downpour and inner living spaces.',
        },
        {
          heading: 'Continuous Cross-Ventilation (The Stack Effect)',
          paragraphs: [
            'During high humidity (frequently 90%+ in July), perceived comfort relies purely on air velocity. High clerestory vents allow rising warm humid air to exhaust, pulling cooler ground-level garden air across living rooms.',
          ],
        },
      ],
    },
  },
  {
    id: 'kerala-building-permits',
    category: 'Permits',
    meta: 'Permits — Aug 2026',
    title: 'Building permits in Kerala, step by step',
    excerpt: 'What to file, who approves it, and how long each stage usually takes.',
    readTime: '7 min read',
    date: '15 Aug 2026',
    author: {
      name: 'Ar. Rashid Ali',
      role: 'Founder & Chief Architect',
      avatar: ASSETS.authorAvatar,
    },
    isCoverPlaceholder: true,
    content: {
      lead: 'Navigating the Kerala Municipality Building Rules (KMBR) and Kerala Panchayat Building Rules (KPBR) is one of the most critical stages in any architectural project. Here is an architect’s transparent guide through the clearance sequence.',
      sections: [
        {
          heading: 'The Approval Sequence: From Land Title to Sanction',
          paragraphs: [
            'Stage 1: Land Category Verification (Paddy/Wetland Act check via village office and Data Bank). Ensure your plot is recorded as "Purayidom" (dry garden land).',
            'Stage 2: Architectural Drawings & Sanketham Portal Filing (Building permit application prepared and digitally submitted by a registered architect or engineer).',
            'Stage 3: Site Inspection by Panchayat / Municipality Assistant Engineer (Checking setbacks, road width, and coverage ratios).',
            'Stage 4: Sanction & Issuance of Permit (Valid for 3 to 5 years, renewable).',
          ],
          highlight: 'Building within 100m of railway lines, coastal regulation zones (CRZ), or hill-slope eco-sensitive zones requires separate NOCs prior to panchayat submission.',
        },
        {
          heading: 'Typical Timelines',
          paragraphs: [
            'For standard residential homes under 300 sq.m (3,229 sq.ft), Panchayat approval typically takes 4 to 6 weeks when title documentation and setback norms are completely compliant.',
          ],
        },
      ],
    },
  },
  {
    id: 'building-hill-slope-wayanad',
    category: 'Costs & planning',
    meta: 'Costs & planning — Jul 2026',
    title: 'Building on a hill slope in Wayanad',
    excerpt: 'Site surveys, retaining walls and the rules that apply to sloping plots.',
    readTime: '9 min read',
    date: '22 Jul 2026',
    author: {
      name: 'Ar. Rashid Ali',
      role: 'Founder & Chief Architect',
      avatar: ASSETS.authorAvatar,
    },
    isCoverPlaceholder: true,
    content: {
      lead: 'A sloping site in the Western Ghats provides breathtaking valley vistas and dramatic natural elevation levels, but demands thoughtful structural engineering and respect for subsoil water tables.',
      sections: [
        {
          heading: 'Work With the Terrain, Never Against It',
          paragraphs: [
            'The single biggest mistake in hill architecture is extensive mass excavation. Cutting a huge shelf out of a hill destabilizes upper strata and triggers soil erosion during July cloudbursts.',
            'We deploy split-level designs, stepped grade beams, and pier foundations that rest lightly on natural contours.',
          ],
          highlight: 'Gravity-fed retaining walls built from locally sourced rubble with weep-holes every 1.5m prevent hydraulic pressure buildup.',
        },
        {
          heading: 'Stormwater Runoff Management',
          paragraphs: [
            'Water must have an uninterrupted path around and beneath the building structure. French drains filled with graduated gravel direct mountain runoff cleanly toward designated natural swales.',
          ],
        },
      ],
    },
  },
  {
    id: 'apartment-fitout-bengaluru',
    category: 'Interiors',
    meta: 'Interiors — Jun 2026',
    title: 'What a full apartment fit-out costs in Bengaluru',
    excerpt: 'Kitchens, wardrobes, lighting — how an interior budget usually splits.',
    readTime: '6 min read',
    date: '10 Jun 2026',
    author: {
      name: 'Ar. Rashid Ali',
      role: 'Founder & Chief Architect',
      avatar: ASSETS.authorAvatar,
    },
    image: ASSETS.projectInterior,
    imageTag: 'Design visualisation',
    content: {
      lead: 'Taking handover of an apartment shell in Bengaluru (Whitefield, Sarjapur, or Jayanagar) marks the beginning of the fit-out journey. Here is how real project budgets split across carpentry, electricals, loose furniture, and finishes.',
      sections: [
        {
          heading: 'Typical Budget Distribution for a 3BHK (1,800 – 2,200 sq.ft)',
          paragraphs: [
            'Modular & Custom Joinery (45%): Kitchen cabinetry (marine ply + acrylic/matte laminate with Blum/Hettich hardware), master bedroom wardrobes, foyer consoles, and study desks.',
            'Civil & Surface Works (20%): False ceiling redesign, architectural lighting layout, stone cladding, and micro-cement wall accents.',
            'Loose Furniture & Soft Furnishings (20%): Solid wood dining sets, custom sofa upholstery, sheer linen drapes, and ergonomic seating.',
            'Appliances & Architectural Hardware (15%): Built-in hobs, ovens, custom brass handles, and sanitary fittings.',
          ],
          highlight: 'A bespoke architect-crafted 3BHK interior ranges from ₹25L to ₹45L depending on veneer vs laminate selections and stone surfaces.',
        },
      ],
    },
  },
  {
    id: 'eco-home-materials-wayanad',
    category: 'Climate & materials',
    meta: 'Climate & materials — May 2026',
    title: 'Eco-home materials you can source near Wayanad',
    excerpt: 'Laterite, bamboo, reclaimed timber and lime — what works and what to avoid.',
    readTime: '7 min read',
    date: '18 May 2026',
    author: {
      name: 'Ar. Rashid Ali',
      role: 'Founder & Chief Architect',
      avatar: ASSETS.authorAvatar,
    },
    image: ASSETS.projectHover,
    imageTag: 'Design visualisation',
    content: {
      lead: 'Authentic sustainable architecture is not about imported carbon-neutral badges; it is about materials that have travelled less than 80 kilometers and breathe with the mountain air.',
      sections: [
        {
          heading: 'Laterite Stone (Vettukallu)',
          paragraphs: [
            'Quarried in North Malabar, laterite is soft when cut and hardens upon atmospheric exposure. It offers exceptional thermal mass, absorbing daytime sun and gently releasing heat during cool Wayanad nights.',
            'Avoid thick plaster coatings; a wire-brushed face treated with a breathable silane-siloxane repellent preserves the earthy reddish-ochre texture forever.',
          ],
        },
        {
          heading: 'Reclaimed Timber & Bamboo',
          paragraphs: [
            'Dismantled traditional Kerala ancestral homes (tharavadu) yield seasoned anjili (wild jackfruit) and teak timbers that do not warp or shrink in extreme weather.',
            'Treated structural bamboo from Uravu (Wayanad’s indigenous bamboo craft cluster) makes lightweight, tensile roof canopies and privacy pergolas.',
          ],
        },
      ],
    },
  },
  {
    id: 'case-study-the-residence',
    category: 'Case studies',
    meta: 'Case studies — Apr 2026',
    title: 'Case study: the Residence',
    excerpt: 'How a family brief became a plan — sketches, decisions and lessons from site.',
    readTime: '5 min read',
    date: '04 Apr 2026',
    author: {
      name: 'Ar. Rashid Ali',
      role: 'Founder & Chief Architect',
      avatar: ASSETS.authorAvatar,
    },
    image: ASSETS.projectCloudHouse,
    imageTag: 'Design visualisation',
    content: {
      lead: 'A 4,200 sq.ft private family villa built on a coffee estate slope in Wayanad. The brief was simple yet exacting: every room must frame a mountain horizon, without requiring artificial air-conditioning.',
      sections: [
        {
          heading: 'The Courtyard as a Central Lung',
          paragraphs: [
            'Instead of grouping rooms along a central hallway, we wrapped the plan around a sunken stone courtyard open to the sky. Rain falls into an interior reflection pool surrounded by local ferns.',
            'The roof planes tilt upwards toward the valley breeze, drawing prevailing winds inward through slatted timber louvers.',
          ],
        },
        {
          heading: 'Lessons from the Ground',
          paragraphs: [
            'By using the soil excavated for the foundation to manufacture stabilized compressed earth blocks (CSEB) right on site, carbon footprint dropped by 38% while blending the building tonally with its coffee terrace.',
          ],
        },
      ],
    },
  },
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Do you take projects outside Wayanad and Bengaluru?',
    answer: 'Yes. Tell us where your site is and we will explain how we can work with you. We regularly take on distinctive residential and hospitality commissions across Kerala, Karnataka, and the wider Western Ghats region.',
  },
  {
    id: 'faq-2',
    question: 'What does an architect’s fee usually include?',
    answer: 'Concept design, drawings for approval, working drawings and site visits. The exact scope is set out in our proposal, covering architectural space planning, 3D visualisations, structural coordination, and material specifications.',
  },
  {
    id: 'faq-3',
    question: 'How long does it take to design a house?',
    answer: 'Design and approvals usually take a few months; construction depends on size and site. We give a timeline after the first site visit, typically allocating 6 to 10 weeks for schematic design and sanction filings.',
  },
  {
    id: 'faq-4',
    question: 'Do you design interiors as well?',
    answer: 'Yes. We design architecture and interiors together, down to the furniture. We believe interior volumes, built-in joinery, lighting, and materiality should be a seamless continuation of the structural architecture.',
  },
];

const CATEGORIES: Category[] = [
  'All',
  'Costs & planning',
  'Climate & materials',
  'Permits',
  'Interiors',
  'Case studies',
];

export const JournalPage: React.FC<JournalPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  
  // Ask Studio modal state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [askFormData, setAskFormData] = useState({ name: '', email: '', question: '' });
  const [askSubmitted, setAskSubmitted] = useState(false);

  // Filter latest articles
  const filteredLatestArticles = useMemo(() => {
    // Exclude the first featured article from latest list, unless filtered
    const rest = ARTICLES_DATA.slice(1);
    if (selectedCategory === 'All') return rest;
    return ARTICLES_DATA.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const featuredArticle = ARTICLES_DATA[0];

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAskSubmitted(true);
    setTimeout(() => {
      setAskSubmitted(false);
      setIsAskModalOpen(false);
      setAskFormData({ name: '', email: '', question: '' });
    }, 2200);
  };

  return (
    <div className="bg-lime text-ink flex flex-col items-start w-full relative selection:bg-ink selection:text-lime">
      {/* 1. HEADER SECTION (Figma: Header / node 22:865) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
          {/* Main Title + Counter */}
          <div className="flex items-start gap-4 sm:gap-6">
            <h1 className="display text-7xl sm:text-9xl md:text-[140px] lg:text-[200px] leading-[0.86] text-ink">
              Journal
            </h1>
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted pt-2 sm:pt-4">
              (07)
            </span>
          </div>

          {/* Subtitle / Intro Description */}
          <p className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink max-w-[460px]">
            Notes from the studio on building in Kerala and Karnataka — costs, climate, permits and the projects on our desk.
          </p>
        </div>
      </section>

      {/* 2. FILTER PILLS (Figma: Filters / node 22:870) */}
      <section className="w-full border-y border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-[18px] py-2 sm:py-[10px] text-[14px] sm:text-[15px] font-medium tracking-[-0.075px] whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none ${
                    isActive
                      ? 'bg-ink text-lime shadow-sm'
                      : 'border border-line text-ink hover:border-ink hover:bg-stone-1/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED ARTICLE SECTION (Figma: Featured / node 22:883) */}
      {selectedCategory === 'All' && (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-20 md:pb-28">
          <div
            onClick={() => onNavigate('article')}
            className="group cursor-pointer flex flex-col lg:flex-row items-stretch lg:items-end gap-8 lg:gap-10"
          >
            {/* Featured Image */}
            <div className="relative w-full lg:w-[840px] h-[360px] sm:h-[460px] lg:h-[560px] shrink-0 overflow-hidden bg-stone-1 flex flex-col justify-end p-4 sm:p-5">
              <img
                alt={featuredArticle.title}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                src={featuredArticle.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
              <span className="relative z-10 font-dm-sans font-medium text-[12px] text-lime">
                {featuredArticle.imageTag}
              </span>
            </div>

            {/* Featured Text */}
            <div className="flex-1 flex flex-col gap-5 sm:gap-6 items-start lg:pb-2">
              <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
                Featured · {featuredArticle.meta}
              </span>

              <h2 className="font-dm-sans font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.05] tracking-[-1.68px] text-ink transition-colors group-hover:text-accent">
                {featuredArticle.title}
              </h2>

              <p className="font-dm-sans font-normal text-lg sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink-muted">
                {featuredArticle.excerpt}
              </p>

              {/* Author Chip */}
              <div className="flex items-center gap-3 pt-2">
                <div className="size-10 rounded-full overflow-hidden bg-stone-1 border border-line shrink-0">
                  <img
                    alt={featuredArticle.author.name}
                    className="size-full object-cover"
                    src={featuredArticle.author.avatar}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-dm-sans font-medium text-[15px] leading-tight text-ink tracking-[-0.075px]">
                    {featuredArticle.author.name}
                  </span>
                  <span className="font-dm-sans font-normal text-[14px] sm:text-[15px] text-ink-muted">
                    {featuredArticle.date} · {featuredArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Read article link */}
              <div className="inline-flex items-center gap-3 border-b border-ink pb-1 pt-2 group-hover:border-neutral-500 transition-colors">
                <span className="font-dm-sans font-medium text-[15px] tracking-[-0.075px] text-ink">
                  Read article
                </span>
                <img
                  alt=""
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  src={ASSETS.iconArrowRightDark}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. LATEST ARTICLES SECTION (Figma: Latest / node 22:899) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        {/* Latest Header with top border */}
        <div className="border-t border-ink pt-5 flex items-start justify-between mb-12 md:mb-16">
          <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-[56px] leading-none tracking-[-1.68px] text-ink">
            {selectedCategory === 'All' ? 'Latest' : selectedCategory}
          </h2>
          <span className="font-dm-sans font-medium text-[12px] text-ink-muted pt-1">
            ({filteredLatestArticles.length.toString().padStart(2, '0')})
          </span>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-16 sm:gap-y-20">
          {filteredLatestArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="group cursor-pointer flex flex-col gap-4 items-start"
            >
              {/* Card Image */}
              <div className={`relative w-full h-[240px] sm:h-[280px] lg:h-[293px] overflow-hidden flex flex-col justify-end p-4 pb-[14px] pt-[16px] px-[16px] ${
                article.image ? 'bg-stone-1' : 'bg-[#d9d9d6]'
              }`}>
                {article.image ? (
                  <>
                    <img
                      alt={article.title}
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      src={article.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                    <span className="relative z-10 font-dm-sans font-medium text-[12px] text-lime">
                      {article.imageTag || 'Design visualisation'}
                    </span>
                  </>
                ) : (
                  <div className="size-full flex flex-col justify-end">
                    <span className="font-dm-sans font-medium text-[12px] text-[#8c8c88]">
                      Cover image
                    </span>
                  </div>
                )}
              </div>

              {/* Metadata category */}
              <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
                {article.meta}
              </span>

              {/* Title */}
              <h3 className="font-dm-sans font-medium text-2xl sm:text-[28px] lg:text-[32px] leading-[1.15] tracking-[-0.64px] text-ink transition-colors group-hover:text-accent">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="font-dm-sans font-normal text-[15px] sm:text-[16px] leading-[1.5] text-ink-muted">
                {article.excerpt}
              </p>

              {/* Read time */}
              <span className="font-dm-sans font-medium text-[14px] sm:text-[15px] tracking-[-0.075px] text-ink pt-1">
                {article.readTime}
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* 5. FAQ SECTION (Figma: FAQ / node 22:948) */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16">
          {/* FAQ Left Column */}
          <div className="flex flex-col items-start gap-5 shrink-0">
            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              FAQ
            </span>
            <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl md:text-[56px] leading-tight tracking-[-1.68px] text-ink">
              Questions<br />clients ask us
            </h2>
          </div>

          {/* FAQ Right Column: Accordion */}
          <div className="w-full lg:w-[840px] flex flex-col">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border-t border-line py-6 transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-start justify-between text-left gap-6 group cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-dm-sans font-normal text-xl sm:text-[22px] leading-[1.4] tracking-[-0.22px] text-ink group-hover:text-accent transition-colors">
                      {faq.question}
                    </span>
                    <span className="shrink-0 size-6 flex items-center justify-center pt-1 text-ink">
                      {isOpen ? (
                        <img
                          alt="Collapse"
                          className="size-5 transition-transform duration-200"
                          src={ASSETS.iconMinus}
                        />
                      ) : (
                        <img
                          alt="Expand"
                          className="size-5 transition-transform duration-200 group-hover:scale-110"
                          src={ASSETS.iconPlus}
                        />
                      )}
                    </span>
                  </button>

                  {/* Accordion Answer Content */}
                  {isOpen && (
                    <div className="pt-3.5 pr-8 animate-in fade-in duration-200">
                      <p className="font-dm-sans font-normal text-[16px] leading-[1.5] text-ink-muted">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. "HAVE A QUESTION" STRIP (Figma: Ask / node 22:977) */}
      <section className="w-full bg-surface border-t border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <h3 className="font-dm-sans font-medium text-2xl sm:text-3xl md:text-[32px] tracking-[-0.64px] text-ink">
            Have a question we should answer here?
          </h3>
          <button
            onClick={() => setIsAskModalOpen(true)}
            className="inline-flex items-center gap-3.5 px-7 py-4 bg-ink text-lime text-[15px] font-medium tracking-[-0.075px] hover:bg-accent transition-colors cursor-pointer shrink-0"
          >
            <span>Ask the studio</span>
            <img alt="" className="size-4" src={ASSETS.iconArrowRightWhite} />
          </button>
        </div>
      </section>

      {/* 7. FIXED FLOATING WHATSAPP BUTTON (Figma: WhatsApp (fixed) / node 41:1592) */}
      <a
        href="https://wa.me/919447000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-6 md:right-10 z-40 bg-ink text-lime flex items-center gap-2.5 pl-4 pr-5 py-3 hover:bg-accent transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <img alt="WhatsApp" className="size-5 shrink-0" src={ASSETS.iconWhatsapp} />
        <span className="font-dm-sans font-medium text-[14px] sm:text-[15px] tracking-[-0.075px] whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>

      {/* 8. ARTICLE READER MODAL (Interactive reader for all articles) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-plaster w-full max-w-3xl my-8 p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-1 text-ink transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pr-8">
              <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
                {activeArticle.meta}
              </span>
              <h2 className="font-dm-sans font-medium text-2xl sm:text-4xl tracking-tight text-ink mt-2 mb-4 leading-tight">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-3 pt-1 border-b border-line pb-6">
                <div className="size-10 rounded-full overflow-hidden bg-stone-1 border border-line">
                  <img
                    alt={activeArticle.author.name}
                    className="size-full object-cover"
                    src={activeArticle.author.avatar}
                  />
                </div>
                <div>
                  <p className="font-dm-sans font-medium text-[15px] text-ink">
                    {activeArticle.author.name}
                  </p>
                  <p className="font-dm-sans font-normal text-[13px] text-ink-muted">
                    {activeArticle.author.role} · {activeArticle.date} · {activeArticle.readTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Image if present */}
            {activeArticle.image && (
              <div className="w-full h-64 sm:h-80 overflow-hidden mb-8 bg-stone-1">
                <img
                  alt={activeArticle.title}
                  className="size-full object-cover"
                  src={activeArticle.image}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="space-y-6 text-ink">
              <p className="font-dm-sans font-normal text-lg sm:text-xl leading-relaxed text-ink/90 border-l-2 border-ink pl-4 italic">
                {activeArticle.content.lead}
              </p>

              {activeArticle.content.sections.map((section, sIdx) => (
                <div key={sIdx} className="pt-4 space-y-3">
                  <h4 className="font-dm-sans font-medium text-xl sm:text-2xl text-ink">
                    {section.heading}
                  </h4>
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="font-dm-sans font-normal text-[16px] leading-[1.6] text-ink/80">
                      {para}
                    </p>
                  ))}
                  {section.highlight && (
                    <div className="bg-surface p-4 sm:p-5 border-l-4 border-ink my-4">
                      <p className="font-dm-sans font-medium text-[15px] text-ink">
                        {section.highlight}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Article Modal Footer CTA */}
            <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-dm-sans text-sm text-ink-muted text-center sm:text-left">
                Want to discuss this topic for your project in Wayanad or Bengaluru?
              </p>
              <button
                onClick={() => {
                  setActiveArticle(null);
                  onNavigate('contact');
                }}
                className="px-6 py-3 bg-ink text-lime text-[14px] font-medium hover:bg-accent transition-colors cursor-pointer shrink-0"
              >
                Book a consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. ASK THE STUDIO MODAL */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-plaster w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsAskModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-1 text-ink transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <span className="font-dm-sans font-medium text-[12px] text-ink-muted">
              Studio Inquiry
            </span>
            <h3 className="font-dm-sans font-medium text-2xl sm:text-3xl tracking-tight text-ink mt-1 mb-2">
              Ask the Studio
            </h3>
            <p className="font-dm-sans font-normal text-sm text-ink-muted mb-6">
              Have a question on building permits, construction rates, or climate design? We feature community questions in upcoming journal essays.
            </p>

            {askSubmitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle2 className="size-12 text-ink stroke-[1.5]" />
                <h4 className="font-dm-sans font-medium text-xl text-ink">
                  Question Received
                </h4>
                <p className="text-sm text-ink-muted max-w-xs">
                  Thank you! Ar. Rashid Ali and the design team will review your question for our next journal publication.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAskSubmit} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-ink mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={askFormData.name}
                    onChange={(e) => setAskFormData({ ...askFormData, name: e.target.value })}
                    placeholder="e.g. Rahul Menon"
                    className="w-full px-3.5 py-2.5 border border-line focus:border-ink focus:outline-none text-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-ink mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={askFormData.email}
                    onChange={(e) => setAskFormData({ ...askFormData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border border-line focus:border-ink focus:outline-none text-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-ink mb-1">
                    Your Question or Topic
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={askFormData.question}
                    onChange={(e) => setAskFormData({ ...askFormData, question: e.target.value })}
                    placeholder="e.g. What are the foundation considerations for building on black cotton soil in Karnataka?"
                    className="w-full px-3.5 py-2.5 border border-line focus:border-ink focus:outline-none text-[15px] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-ink text-lime font-medium text-[15px] hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Submit Question</span>
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};