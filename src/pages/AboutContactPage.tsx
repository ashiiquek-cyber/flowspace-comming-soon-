import React, { useState } from 'react';
import { ASSETS } from '../constants/assets';
import { Aperture } from '../components/Aperture';
import type { NavigateTarget } from '../data/projects';

interface AboutContactPageProps {
  onNavigate: (target: NavigateTarget) => void;
}

const PRINCIPLES = [
  {
    title: 'Boxes and flowing lines',
    body: 'Rectangular volumes hold the different functions of a project. Flowing lines of circulation, access, natural light and ventilation weave through every one of them. It is the idea our emblem draws, and the one every plan starts from.',
  },
  {
    title: 'Rooted in site and story',
    body: 'Whatever the scale or type, from a budget home to an eco village, each project starts from its site conditions and the client’s brief, and is a chance to find an approach and a narrative of its own.',
  },
  {
    title: 'Comfort in the detail',
    body: 'A fresh, forward-looking aesthetic where comfort and function sit together. We explore new materials and detail them with care down to the smallest element, so spaces answer to the people in them and the place around them.',
  },
];

const SERVICES = [
  { title: 'Architecture', body: 'Buildings that work with their microclimate and respond to natural forces, for comfort, sustainability and everyday function.' },
  { title: 'Interior design', body: 'Comfortable, functional interiors tailored to each client’s brief, with form, function and use in balance.' },
  { title: 'Landscape design', body: 'Theme-led outdoor spaces built on flowing lines and storytelling, made to be felt as much as seen.' },
  { title: 'Master planning', body: 'Theme-driven plans with clear access, smooth circulation and well-integrated services.' },
  { title: 'Product design', body: 'Research-led products developed for a specific project or subject, where usability and context come first.' },
];

const RECOGNITION = [
  { year: '2026', title: 'Innovative & Most Futuristic Architecture, Landscape & Interior Design Firm of the Year, South India', note: 'Design & Vision Built Environment Awards and Conference, Novotel, Panaji, Goa. Awarded for residential and commercial projects.' },
  { year: '2026', title: 'Trusted & Creative Architect & Designer of the Year, South India', note: 'A special honour to Ar. Rashid Ali at the Design & Vision Built Environment Awards, Goa.' },
  { year: '2024', title: 'Vanitha Veedu Young Architect Award', note: 'Awarded to Ar. Rashid Ali for excellence in environmentally responsive hillside homes in Kerala.' },
  { year: '2023', title: 'FOAID, Festival of Architecture and Interior Design', note: 'Silver medalist in creative commercial and sustainable workspaces.' },
  { year: '2022', title: 'Architectural Digest and Houzz featured practice', note: 'Featured for innovative courtyard design and natural material palettes in South India.' },
];

/** Studio team. Add `portrait` once a photo is matched to a name. */
const TEAM: { name: string; role: string; portrait?: string }[] = [
  { name: 'Muhammed Salman', role: 'Senior Designer' },
  { name: 'Vibhav P', role: 'Architect' },
  { name: 'Amana Fida', role: 'Architect', portrait: ASSETS.portraitAmana },
  { name: 'Eldho Johny', role: 'Junior Designer' },
];

const PROJECT_TYPES =['Residential', 'Commercial', 'Apartments', 'Interiors', 'Other'];

const inputClass =
  'w-full bg-transparent border-0 border-b border-line px-0 py-3 text-[17px] text-ink placeholder:text-stone-2 focus:outline-none focus:border-ink focus-visible:outline-none transition-colors';

export const AboutContactPage: React.FC<AboutContactPageProps> = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    location: '',
    message: '',
  });

  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="flex flex-col">
      <section className="page-x pt-16 md:pt-24 pb-16 md:pb-24">
        <h1 className="display text-[22vw] md:text-[14vw] lg:text-[12vw]">Studio</h1>
        <div className="grid-page gap-y-6 mt-10 md:mt-16">
          <h2 className="col-span-12 md:col-span-3 label pt-2">About</h2>
          <div className="col-span-12 md:col-span-9 lg:col-span-8">
            <p className="prose-serif text-[26px] sm:text-[34px] lg:text-[42px] leading-[1.15]">
              Flowspace Architects is an architecture and design studio founded in 2016 by Chief Architect Ar. Rashid Ali, with studios in Kalpetta, Wayanad (Kerala) and Jayanagar, Bengaluru (Karnataka).
            </p>
            <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              We see architecture as more than building: it is a narrative, a response and a reflection. Every space should tell its own story to the people who live and work in it.
            </p>
          </div>
        </div>
      </section>

      <figure className="pb-24 md:pb-36">
        <Aperture src={ASSETS.heroBg} alt="Double-height studio space opening onto a planted courtyard" className="w-full aspect-[4/3] md:aspect-[21/9]" />
        <figcaption className="page-x label mt-3">Wayanad studio, Kalpetta</figcaption>
      </figure>

      <section className="page-x pb-24 md:pb-36" aria-labelledby="approach-heading">
        <div className="grid-page gap-y-10">
          <h2 id="approach-heading" className="col-span-12 md:col-span-3 display text-[44px] sm:text-[56px]">Approach</h2>
          <div className="col-span-12 md:col-span-9 grid md:grid-cols-3 gap-x-10 gap-y-12">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="border-t border-ink pt-5">
                <h3 className="text-[22px] tracking-tight leading-tight">{p.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted mt-4">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="col-span-12 md:col-start-4 md:col-span-8 lg:col-start-4 lg:col-span-7 prose-serif text-[22px] sm:text-[26px] leading-snug">
            The flowing lines carry the same elements through every plan: air and ventilation, pockets of natural light, courtyards, interactive spaces, water bodies, Vastu and easy access. Each project is also a piece of research, shaped by its microclimate.
          </p>
        </div>
      </section>

      <section className="page-x pb-24 md:pb-36" aria-labelledby="services-heading">
        <div className="grid-page gap-y-8">
          <h2 id="services-heading" className="col-span-12 md:col-span-3 display text-[44px] sm:text-[56px]">Services</h2>
          <ul className="col-span-12 md:col-span-9 border-b border-line">
            {SERVICES.map((s) => (
              <li key={s.title} className="grid sm:grid-cols-[14rem_1fr] gap-x-6 gap-y-1 border-t border-line py-5">
                <h3 className="text-[20px] sm:text-[22px] tracking-tight">{s.title}</h3>
                <p className="text-[15px] text-ink-muted leading-relaxed max-w-[60ch] sm:pt-1">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-x pb-24 md:pb-36" aria-labelledby="people-heading">
        <div className="grid-page gap-y-10">
          <h2 id="people-heading" className="col-span-12 md:col-span-3 display text-[44px] sm:text-[56px]">People</h2>
          <div className="col-span-12 md:col-span-9 flex flex-col gap-16 md:gap-24">
            <div className="border-t border-ink pt-5 grid sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-10 gap-y-8">
              <Aperture
                src={ASSETS.portraitRashid}
                alt="Ar. Rashid Ali, Founder and Chief Architect"
                className="w-full max-w-[400px] aspect-[4/5]"
              />
              <div className="flex flex-col">
                <h3 className="text-[26px] tracking-tight">Ar. Rashid Ali</h3>
                <p className="text-ink-muted text-[15px] mt-1">Founder and Chief Architect</p>
                <p className="prose-serif text-[19px] leading-snug mt-6 max-w-[34ch]">
                  Leads every project from the first site walk to handover, across both studios.
                </p>
                <p className="text-[15px] leading-relaxed text-ink-muted mt-6 max-w-[46ch]">
                  Bachelor of Architecture, Visvesvaraya Technological University (VTU). Before founding Flowspace in 2016 he worked with studios including K2 India, Thirdspace, Arcon Intlands, and Sahil and Sarthak.
                </p>
                <p className="label mt-6">COA Reg. CA/2016/76777, Indian Institute of Architects</p>
              </div>
            </div>

            <div>
              <div className="border-t border-ink pt-5 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
                <h3 className="text-[26px] tracking-tight">Studio team</h3>
                <p className="text-ink-muted text-[15px]">A full-service team working across Wayanad and Bengaluru.</p>
              </div>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-8">
                {TEAM.map((m) => (
                  <li key={m.name}>
                    {m.portrait ? (
                      <Aperture src={m.portrait} alt={`${m.name}, ${m.role}`} className="w-full aspect-[4/5]" />
                    ) : (
                      <div className="w-full aspect-[4/5] bg-stone-1" aria-hidden="true" />
                    )}
                    <p className="text-[17px] tracking-tight mt-4">{m.name}</p>
                    <p className="text-ink-muted text-[14px] mt-0.5">{m.role}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="recognition-section" className="page-x pb-24 md:pb-36" aria-labelledby="recognition-heading">
        <div className="grid-page gap-y-8">
          <h2 id="recognition-heading" className="col-span-12 md:col-span-3 display text-[44px] sm:text-[56px]">Recognition</h2>
          <ul className="col-span-12 md:col-span-9 border-b border-line">
            {RECOGNITION.map((a) => (
              <li key={a.title} className="grid grid-cols-[4rem_1fr] sm:grid-cols-[6rem_1fr] gap-4 border-t border-line py-6">
                <span className="text-ink-muted tabular-nums text-[15px] pt-1">{a.year}</span>
                <div>
                  <h3 className="text-[20px] sm:text-[22px] tracking-tight">{a.title}</h3>
                  <p className="text-[15px] text-ink-muted mt-1 leading-relaxed max-w-[60ch]">{a.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href="#/press" className="col-span-12 md:col-start-4 text-link self-start justify-self-start text-[15px]">Press and awards</a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact-section" className="bg-plaster page-x py-24 md:py-36" aria-labelledby="contact-heading">
        <div className="grid-page gap-y-16">
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-12">
            <h2 id="contact-heading" className="display text-[56px] sm:text-[80px] lg:text-[96px]">Start a conversation.</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-10 text-[15px] leading-relaxed">
              <div>
                <h3 className="text-[19px] tracking-tight mb-2">Wayanad studio</h3>
                <p className="text-ink-muted">Kalpetta, Wayanad<br />Kerala 673122, India</p>
              </div>
              <div>
                <h3 className="text-[19px] tracking-tight mb-2">Bengaluru studio</h3>
                <p className="text-ink-muted">3rd Floor, 1 Krishna Rajendra Road<br />7th Block, Jayanagar<br />Bengaluru 560070, India</p>
                <a href="tel:+919747859991" className="text-link mt-3">+91 97478 59991</a>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
              <a href="mailto:flowspacearchitects@gmail.com" className="text-link">flowspacearchitects@gmail.com</a>
              <a href="https://wa.me/919747859991" target="_blank" rel="noreferrer" className="text-link">Chat on WhatsApp</a>
            </div>
          </div>

          <div className="col-span-12 lg:col-start-7 lg:col-span-6">
            {formSubmitted ? (
              <div className="border-t border-ink pt-8" role="status">
                <h3 className="text-[30px] tracking-tight font-light">Thank you, {formData.name.split(' ')[0] || 'we have your message'}.</h3>
                <p className="text-[16px] text-ink-muted mt-4 max-w-[44ch] leading-relaxed">
                  Ar. Rashid Ali or our studio lead will review your project brief and reply to {formData.email || 'you'} within 24 hours.
                </p>
                <button onClick={() => setFormSubmitted(false)} className="text-link mt-8 text-[15px]">Send another enquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8 border-t border-ink pt-8">
                <div>
                  <h3 className="text-[24px] tracking-tight">Book a consultation</h3>
                  <p className="text-[15px] text-ink-muted mt-1">Tell us about your site, requirements, and timeline.</p>
                </div>

                <fieldset>
                  <legend className="label mb-3">Project type</legend>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
                    {PROJECT_TYPES.map((type) => {
                      const checked = formData.projectType === type;
                      return (
                        <label
                          key={type}
                          className={`cursor-pointer pb-0.5 border-b transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent outline-offset-4 ${
                            checked ? 'text-ink border-ink' : 'text-ink-muted border-transparent hover:text-ink'
                          }`}
                        >
                          <input
                            type="radio"
                            name="projectType"
                            value={type}
                            checked={checked}
                            onChange={() => setFormData({ ...formData, projectType: type })}
                            className="sr-only"
                          />
                          {type}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                  <label className="block">
                    <span className="label">Your name</span>
                    <input required type="text" autoComplete="name" placeholder="Rahul Nair" value={formData.name} onChange={set('name')} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="label">Email</span>
                    <input required type="email" autoComplete="email" placeholder="rahul@example.com" value={formData.email} onChange={set('email')} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="label">Phone or WhatsApp (optional)</span>
                    <input type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={set('phone')} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="label">Site location (optional)</span>
                    <input type="text" placeholder="Kalpetta, Wayanad" value={formData.location} onChange={set('location')} className={inputClass} />
                  </label>
                </div>

                <label className="block">
                  <span className="label">About the project (optional)</span>
                  <textarea
                    rows={4}
                    placeholder="Plot size, slope, rooms needed, or what you hope the house will feel like"
                    value={formData.message}
                    onChange={set('message')}
                    className={`${inputClass} resize-none`}
                  />
                </label>

                <button type="submit" className="btn-solid self-start">Send enquiry</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
