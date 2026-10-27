import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { LagItem } from '../components/ParallaxLag';

interface AboutContactPageProps {
  onNavigate: (page: 'home' | 'projects' | 'project-detail' | 'studio' | 'journal' | 'article' | 'press') => void;
}

export const AboutContactPage: React.FC<AboutContactPageProps> = ({ onNavigate }) => {
  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    location: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-white text-ink flex flex-col items-start w-full relative">
      {/* 1. HEADER SECTION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="flex flex-col gap-10">
          <h1 className="font-dm-sans font-medium text-6xl sm:text-8xl md:text-[140px] lg:text-[180px] leading-[0.86] tracking-[-4px] sm:tracking-[-8px] lg:tracking-[-12px] text-ink">
            Studio
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-line pt-10">
            <div className="lg:col-span-3">
              <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
                (About)
              </p>
            </div>
            <div className="lg:col-span-9">
              <p className="font-dm-sans font-medium text-2xl sm:text-4xl md:text-5xl leading-[1.15] tracking-tight text-ink">
                Flowspace Architects is an architecture and design studio founded by Chief Architect Ar. Rashid Ali, with studios in Kalpetta, Wayanad (Kerala) and Jayanagar, Bengaluru (Karnataka).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STUDIO IMAGE */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-24 md:pb-36">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-surface rounded-[2px]">
          <img
            alt="Flowspace Architecture Studio Space"
            className="size-full object-cover"
            src={ASSETS.heroBg}
          />
        </div>
        <p className="text-[13px] text-ink-muted mt-3">
          Wayanad Design Studio — Kalpetta workspace
        </p>
      </section>

      {/* 3. APPROACH & DESIGN PRINCIPLES */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-24 md:pb-36">
        <div className="border-t border-ink pt-8 mb-12 flex items-baseline justify-between">
          <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl tracking-tight text-ink">
            Approach
          </h2>
          <span className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
            (03 Principles)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {[
            {
              step: "(01)",
              title: "Context & Topography",
              body: "We do not impose foreign templates onto land. Whether designing for steep mountain slopes in Wayanad or dense urban plots in Bengaluru, the land dictates the orientation, elevation levels, and water flow.",
              duration: "Respecting the terrain",
              lag: 0
            },
            {
              step: "(02)",
              title: "Material Honesty",
              body: "We work with materials that age with dignity: exposed laterite, red terracotta bricks, lime wash, river stone, and locally salvaged timber. No artificial cladding, no cosmetic skins.",
              duration: "Authentic materiality",
              lag: 0.14
            },
            {
              step: "(03)",
              title: "Passive Climate Design",
              body: "Kerala's intense monsoon rains and Bengaluru's dry summers require specific architectural responses: deep roof overhangs, central courtyards for cross ventilation, and shaded verandas.",
              duration: "Microclimate harmony",
              lag: 0
            }
          ].map((card, idx) => (
            <LagItem
              key={idx}
              lag={card.lag}
              inertia={card.lag > 0}
              wrapperClassName="h-full"
              className="bg-surface border-t border-ink p-8 flex flex-col justify-between min-h-[360px]"
            >
              <div>
                <span className="font-dm-sans font-medium text-5xl text-ink-muted tracking-[-2px] block mb-6">
                  {card.step}
                </span>
                <h4 className="font-dm-sans font-medium text-2xl tracking-tight text-ink mb-3">
                  {card.title}
                </h4>
                <p className="text-[15px] leading-relaxed text-ink-muted">
                  {card.body}
                </p>
              </div>
              <p className="mt-8 text-[12px] uppercase tracking-[0.48px] font-medium text-ink">
                {card.duration}
              </p>
            </LagItem>
          ))}
        </div>
      </section>

      {/* 4. PEOPLE / FOUNDER */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-24 md:pb-36">
        <div className="border-t border-ink pt-8 mb-12 flex items-baseline justify-between">
          <h2 className="font-dm-sans font-medium text-4xl sm:text-5xl tracking-tight text-ink">
            People
          </h2>
          <span className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
            (Leadership)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Ar. Rashid Ali */}
          <LagItem lag={0} className="flex flex-col gap-4">
            <div className="aspect-[3/4] w-full overflow-hidden bg-stone-1 rounded-[2px] relative">
              <img
                alt="Ar. Rashid Ali"
                className="size-full object-cover"
                src={ASSETS.founderPhoto}
              />
            </div>
            <div>
              <h3 className="font-dm-sans font-medium text-xl text-ink">
                Ar. Rashid Ali
              </h3>
              <p className="text-[14px] text-ink-muted mt-0.5">
                Founder & Chief Architect
              </p>
              <p className="text-[13px] text-ink-muted mt-2 font-light">
                COA Reg. CA/2016/76777 · Indian Institute of Architects (IIA)
              </p>
            </div>
          </LagItem>

          {/* Senior Architect / Project Lead */}
          <LagItem lag={0.14} inertia className="flex flex-col gap-4">
            <div className="aspect-[3/4] w-full overflow-hidden bg-stone-1 rounded-[2px] relative flex items-end p-6">
              <img
                alt="Studio Team"
                className="absolute inset-0 size-full object-cover"
                src={ASSETS.projectHover}
              />
              <div className="absolute inset-0 bg-ink/30" />
              <span className="relative z-10 text-white text-[13px] font-medium">
                Design Team · Wayanad
              </span>
            </div>
            <div>
              <h3 className="font-dm-sans font-medium text-xl text-ink">
                Architecture & Interior Studio
              </h3>
              <p className="text-[14px] text-ink-muted mt-0.5">
                Architectural Associates & Site Engineers
              </p>
              <p className="text-[13px] text-ink-muted mt-2 font-light">
                Full-service team across Wayanad & Bengaluru
              </p>
            </div>
          </LagItem>
        </div>
      </section>

      {/* 5. RECOGNITION & HONOURS */}
      <section id="recognition-section" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-ink pt-8">
          <div className="lg:col-span-4">
            <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium">
              (Recognition)
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col">
            {[
              {
                year: "2024",
                title: "Vanitha Veedu — Young Architect Award",
                note: "Awarded to Ar. Rashid Ali for excellence in environmentally responsive hillside homes in Kerala."
              },
              {
                year: "2023",
                title: "FOAID — Festival of Architecture & Interior Design",
                note: "Silver Medalist in Creative Commercial & Sustainable Workspaces category."
              },
              {
                year: "2022",
                title: "Architectural Digest & Houzz Featured Practice",
                note: "Featured for innovative courtyard design and natural material palettes in South India."
              }
            ].map((award, i) => (
              <div key={i} className="border-t border-line py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <span className="text-[14px] font-medium text-ink-muted w-20">
                  {award.year}
                </span>
                <div className="flex-1">
                  <h4 className="font-dm-sans font-medium text-xl text-ink">
                    {award.title}
                  </h4>
                  <p className="text-[14px] text-ink-muted mt-1 leading-relaxed">
                    {award.note}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-line" />
          </div>
        </div>
      </section>

      {/* 6. CONTACT US & INQUIRY FORM */}
      <section id="contact-section" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-28 md:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-ink pt-12">
          {/* Left Column: Office Contacts */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-3">
                (Contact)
              </p>
              <h2 className="font-dm-sans font-medium text-4xl sm:text-6xl tracking-[-2px] text-ink mb-8 leading-tight">
                Start a<br />conversation.
              </h2>

              <div className="flex flex-col gap-8">
                {/* Wayanad Office */}
                <div>
                  <h4 className="font-dm-sans font-medium text-xl text-ink mb-2">
                    Wayanad Studio
                  </h4>
                  <p className="text-[15px] text-ink-muted leading-relaxed font-light">
                    Kalpetta, Wayanad<br />
                    Kerala 673122, India
                  </p>
                  <a href="tel:+919447000000" className="inline-block text-[14px] text-ink hover:text-accent font-medium mt-2">
                    +91 94470 00000
                  </a>
                </div>

                {/* Bengaluru Office */}
                <div>
                  <h4 className="font-dm-sans font-medium text-xl text-ink mb-2">
                    Bengaluru Studio
                  </h4>
                  <p className="text-[15px] text-ink-muted leading-relaxed font-light">
                    Jayanagar, Bengaluru<br />
                    Karnataka 560011, India
                  </p>
                  <a href="tel:+919845000000" className="inline-block text-[14px] text-ink hover:text-accent font-medium mt-2">
                    +91 98450 00000
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-surface text-ink hover:bg-stone-1 transition-colors text-[15px] font-medium"
              >
                <img alt="" className="size-5" src={ASSETS.iconWhatsapp} />
                <span>Chat on WhatsApp directly</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="lg:col-span-7 bg-surface p-8 sm:p-12 rounded-[2px]">
            {formSubmitted ? (
              <div className="py-16 text-center flex flex-col items-center gap-4">
                <div className="size-14 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h3 className="font-dm-sans font-medium text-3xl text-ink">
                  Thank you for reaching out
                </h3>
                <p className="text-[16px] text-ink-muted max-w-[440px] leading-relaxed">
                  Ar. Rashid Ali or our studio lead will review your project brief and get in touch within 24 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-6 py-2.5 border border-ink text-ink text-[14px] font-medium hover:bg-ink hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <h3 className="font-dm-sans font-medium text-2xl text-ink mb-1">
                    Book a Consultation / Inquire
                  </h3>
                  <p className="text-[14px] text-ink-muted">
                    Tell us about your site, requirements, and timeline.
                  </p>
                </div>

                {/* Project Type Selector */}
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-2">
                    Project Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Residential', 'Commercial', 'Apartments', 'Interiors', 'Other'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, projectType: type })}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                          formData.projectType === type
                            ? 'bg-ink text-white'
                            : 'bg-white border border-line text-ink hover:border-ink'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rahul Nair"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-line text-ink text-[15px] focus:outline-none focus:border-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-line text-ink text-[15px] focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>

                {/* Phone & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-line text-ink text-[15px] focus:outline-none focus:border-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
                      Site Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kalpetta, Wayanad or Bengaluru"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-line text-ink text-[15px] focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[12px] uppercase tracking-[0.48px] text-ink-muted font-medium mb-1.5">
                    Project Details & Scope
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the plot size, topography, rooms needed, or your design aspirations..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-line text-ink text-[15px] focus:outline-none focus:border-ink resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-ink text-white font-medium text-[15px] tracking-tight hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Send enquiry</span>
                  <img alt="" className="size-4" src={ASSETS.iconArrowRightWhite} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
