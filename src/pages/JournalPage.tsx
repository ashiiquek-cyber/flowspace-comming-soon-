import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RouteLink } from '../components/RouteLink';
import type { NavigateTarget } from "../data/projects";
import { ASSETS } from '../constants/assets';
import { X, CheckCircle2 } from 'lucide-react';
import { useDialog } from '../lib/useDialog';

interface JournalPageProps {
  onNavigate: (target: NavigateTarget) => void;
  /** Set by the address #/journal/<id>: opens that article in the reader */
  articleId?: string;
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
      avatar: ASSETS.avatarRashid,
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
      avatar: ASSETS.avatarRashid,
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
      avatar: ASSETS.avatarRashid,
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
      avatar: ASSETS.avatarRashid,
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
      avatar: ASSETS.avatarRashid,
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
      avatar: ASSETS.avatarRashid,
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
      avatar: ASSETS.avatarRashid,
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

export const JournalPage: React.FC<JournalPageProps> = ({ onNavigate, articleId }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // The open article comes from the address (#/journal/<id>), so it can be linked and shared
  const activeArticle = useMemo(() => ARTICLES_DATA.find((a) => a.id === articleId) ?? null, [articleId]);
  // Closing should not leave a history entry that Back would reopen. Opened from this list:
  // step back to the list's entry. Arrived open (a shared link): swap the entry for the list.
  // (A mount-time flag, not an effect: StrictMode re-runs effects and would misreport it.)
  const arrivedOpen = useRef(!!articleId);
  const closeArticle = () => {
    if (arrivedOpen.current) {
      arrivedOpen.current = false;
      window.location.replace('#/journal');
    } else {
      window.history.back();
    }
  };
  const articleCloseRef = useRef<HTMLButtonElement>(null);
  useDialog(!!activeArticle, closeArticle, articleCloseRef);

  useEffect(() => {
    if (!activeArticle) return;
    document.title = `${activeArticle.title} — Flowspace Architects`;
    // Not a captured "previous": on a direct visit this runs before App sets the page title.
    // When leaving the journal entirely, App's own title effect runs after this and wins.
    return () => { document.title = 'Journal — Flowspace Architects'; };
  }, [activeArticle]);

  // Ask the studio modal state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [askFormData, setAskFormData] = useState({ name: '', email: '', question: '' });
  const [askSubmitted, setAskSubmitted] = useState(false);
  const askCloseRef = useRef<HTMLButtonElement>(null);
  useDialog(isAskModalOpen, () => setIsAskModalOpen(false), askCloseRef);

  const counts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, c === 'All' ? ARTICLES_DATA.length : ARTICLES_DATA.filter((a) => a.category === c).length])),
    [],
  );

  // With no filter the first article is featured above, so the list starts from the second
  const filteredLatestArticles = useMemo(() => {
    if (selectedCategory === 'All') return ARTICLES_DATA.slice(1);
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
    <div className="bg-lime text-ink w-full relative">
      {/* Header */}
      <section className="page-x pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="grid-page gap-y-8">
          <h1 className="col-span-12 md:col-span-8 display text-[16vw] md:text-[9vw]">Journal</h1>
          <p className="col-span-12 md:col-span-4 md:self-end label max-w-[34ch] leading-relaxed">
            Notes from the studio on building in Kerala and Karnataka: costs, climate, permits and the projects on our desk.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-y border-line">
        <div
          role="group"
          aria-label="Filter articles by topic"
          className="page-x py-5 flex items-center gap-x-6 sm:gap-x-8 overflow-x-auto scrollbar-none text-[15px]"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={active}
                className={`whitespace-nowrap transition-colors ${active ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                <span className={active ? 'border-b border-ink pb-0.5' : ''}>{cat}</span>
                <sup className="ml-0.5 text-[10px] tabular-nums">{counts[cat]}</sup>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured article */}
      {selectedCategory === 'All' && (
        <section className="page-x pt-12 md:pt-16 pb-20 md:pb-28">
          <RouteLink to="article" onNavigate={onNavigate} className="group grid-page gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-8 aspect-[4/3] lg:aspect-[3/2] overflow-hidden bg-stone-1">
              <img
                alt=""
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                src={featuredArticle.image}
              />
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 items-start lg:pb-1">
              <p className="label">Featured</p>
              <h2 className="text-[32px] sm:text-[40px] leading-[1.08] tracking-[-0.03em] transition-colors group-hover:text-accent">
                {featuredArticle.title}
              </h2>
              <p className="text-[18px] leading-[1.45] text-ink-muted">{featuredArticle.excerpt}</p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  alt=""
                  className="size-10 rounded-full object-cover bg-stone-1 shrink-0"
                  src={featuredArticle.author.avatar}
                />
                <div className="flex flex-col">
                  <span className="text-[15px] leading-tight">{featuredArticle.author.name}</span>
                  <span className="label">
                    {featuredArticle.date}, {featuredArticle.readTime}
                  </span>
                </div>
              </div>
              <span className="text-link text-[15px] mt-1">Read article</span>
            </div>
          </RouteLink>
        </section>
      )}

      {/* Latest articles */}
      <section className="page-x pb-28 md:pb-40">
        <div className="border-t border-line pt-5 mb-10 md:mb-14">
          <h2 className="label">{selectedCategory === 'All' ? 'Latest' : selectedCategory}</h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-16 sm:gap-y-20">
          {filteredLatestArticles.map((article) => (
            <li key={article.id}>
              <a href={`#/journal/${article.id}`} className="group flex flex-col gap-4 items-start">
                {article.image ? (
                  <div className="w-full aspect-[4/3] overflow-hidden bg-stone-1 mb-1">
                    <img
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      src={article.image}
                    />
                  </div>
                ) : (
                  // No cover yet: a text-only card with the rule the image would have sat on
                  <span aria-hidden className="block w-full border-t border-ink" />
                )}
                <p className="label">
                  {article.category}, {article.date}
                </p>
                <h3 className="text-[24px] sm:text-[28px] leading-[1.15] tracking-[-0.02em] transition-colors group-hover:text-accent">
                  {article.title}
                </h3>
                <p className="text-[16px] leading-[1.5] text-ink-muted">{article.excerpt}</p>
                <span className="label text-ink">{article.readTime}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="page-x pb-28 md:pb-40">
        <div className="grid-page gap-y-8 border-t border-line pt-5">
          <h2 className="col-span-12 lg:col-span-3 label">Questions clients ask</h2>
          <div className="col-span-12 lg:col-span-8 lg:col-start-5 flex flex-col">
            {FAQ_ITEMS.map((faq, i) => {
              const isOpen = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className={`py-6 ${i > 0 ? 'border-t border-line' : ''}`}>
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-start justify-between text-left gap-6 group"
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-answer`}
                  >
                    <span className="text-[20px] sm:text-[22px] leading-[1.4] tracking-[-0.01em] group-hover:text-accent transition-colors">
                      {faq.question}
                    </span>
                    <img
                      alt=""
                      className="size-5 shrink-0 mt-1.5"
                      src={isOpen ? ASSETS.iconMinus : ASSETS.iconPlus}
                    />
                  </button>
                  {isOpen && (
                    <p id={`${faq.id}-answer`} className="pt-3.5 pr-8 text-[16px] leading-[1.6] text-ink-muted max-w-[62ch] animate-in">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ask the studio */}
      <section className="bg-plaster border-t border-line">
        <div className="page-x py-12 md:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <h2 className="prose-serif text-[28px] sm:text-[36px] leading-[1.15]">
            Have a question we should answer here?
          </h2>
          <button onClick={() => setIsAskModalOpen(true)} className="btn-solid shrink-0">
            Ask the studio
          </button>
        </div>
      </section>

      {/* Article reader */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in"
          onClick={(e) => e.target === e.currentTarget && closeArticle()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-title"
            data-lenis-prevent
            className="bg-plaster w-full max-w-3xl p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto overscroll-contain"
          >
            <button
              ref={articleCloseRef}
              onClick={closeArticle}
              className="absolute top-5 right-5 p-2 text-ink hover:text-accent transition-colors"
              aria-label="Close article"
            >
              <X size={22} />
            </button>

            <div className="mb-6 pr-10">
              <p className="label">{activeArticle.category}</p>
              <h2 id="article-title" className="text-[28px] sm:text-[40px] leading-[1.1] tracking-[-0.03em] mt-2 mb-5">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-3 border-b border-line pb-6">
                <img alt="" className="size-10 rounded-full object-cover bg-stone-1" src={activeArticle.author.avatar} />
                <div>
                  <p className="text-[15px]">{activeArticle.author.name}, {activeArticle.author.role}</p>
                  <p className="label">
                    {activeArticle.date}, {activeArticle.readTime}
                  </p>
                </div>
              </div>
            </div>

            {activeArticle.image && (
              <div className="w-full aspect-[16/9] overflow-hidden mb-8 bg-stone-1">
                <img alt="" className="size-full object-cover" src={activeArticle.image} />
              </div>
            )}

            <div className="space-y-6">
              <p className="prose-serif text-[20px] sm:text-[22px] leading-relaxed">{activeArticle.content.lead}</p>
              {activeArticle.content.sections.map((section) => (
                <div key={section.heading} className="pt-4 space-y-3">
                  <h3 className="text-[20px] sm:text-[24px] leading-snug">{section.heading}</h3>
                  {section.paragraphs.map((para) => (
                    <p key={para} className="text-[16px] leading-[1.65] text-ink/80">{para}</p>
                  ))}
                  {section.highlight && (
                    <p className="border-l-2 border-accent pl-4 my-5 text-[16px] leading-[1.55]">{section.highlight}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="label">Want to talk this through for your project in Wayanad or Bengaluru?</p>
              <RouteLink to="contact" onNavigate={onNavigate} className="btn-solid shrink-0">
                Book a consultation
              </RouteLink>
            </div>
          </div>
        </div>
      )}

      {/* Ask the studio dialog */}
      {isAskModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in"
          onClick={(e) => e.target === e.currentTarget && setIsAskModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ask-title"
            data-lenis-prevent
            className="bg-plaster w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              ref={askCloseRef}
              onClick={() => setIsAskModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-ink hover:text-accent transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 id="ask-title" className="text-[26px] sm:text-[30px] tracking-[-0.02em] mb-2 pr-10">
              Ask the studio
            </h2>
            <p className="label leading-relaxed mb-6">
              A question on permits, building costs or climate design? We answer the most common ones in the journal.
            </p>

            {askSubmitted ? (
              <div role="status" className="py-8 flex flex-col items-center text-center gap-3">
                <CheckCircle2 className="size-10 text-accent stroke-[1.5]" />
                <p className="text-[20px]">Question received</p>
                <p className="label max-w-xs">Thank you. We will look at it for an upcoming journal piece.</p>
              </div>
            ) : (
              <form onSubmit={handleAskSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ask-name" className="block label text-ink mb-1">Your name</label>
                  <input
                    id="ask-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={askFormData.name}
                    onChange={(e) => setAskFormData({ ...askFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-transparent border border-line focus:border-ink focus:outline-none text-[15px]"
                  />
                </div>
                <div>
                  <label htmlFor="ask-email" className="block label text-ink mb-1">Email</label>
                  <input
                    id="ask-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={askFormData.email}
                    onChange={(e) => setAskFormData({ ...askFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-transparent border border-line focus:border-ink focus:outline-none text-[15px]"
                  />
                </div>
                <div>
                  <label htmlFor="ask-question" className="block label text-ink mb-1">Your question</label>
                  <textarea
                    id="ask-question"
                    rows={4}
                    required
                    value={askFormData.question}
                    onChange={(e) => setAskFormData({ ...askFormData, question: e.target.value })}
                    placeholder="For example: what foundations suit black cotton soil in Karnataka?"
                    className="w-full px-3.5 py-2.5 bg-transparent border border-line focus:border-ink focus:outline-none text-[15px] resize-none"
                  />
                </div>
                <button type="submit" className="btn-solid w-full mt-2">
                  Send question
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
