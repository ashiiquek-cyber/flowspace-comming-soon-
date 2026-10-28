# Flowspace Architects: redesign notes

## 1. What existed

Vite + React 18 + Tailwind 3 + Lenis, with hash routing across seven views: home, projects, project detail, studio and contact, journal, article, and press.

- **Kept:** all content, the Didact Gothic wordmark, the contour emblem, Lenis smooth scroll, the project data, the journal and press content, the forms, the before/after slider, and the honest "design visualisation" captions.
- **Looked generic:** an all-caps eyebrow over every heading; `(01)`-style labels on content that is not a sequence; big-number stat blocks; pill chips everywhere; stacked sticky cards with gradient overlays; a custom per-element "lag" parallax on dozens of blocks (motion with no meaning); orange `#e8461e` used for hover states site-wide.
- **Broken or weak:** project detail always showed The Cloud House whatever you clicked; the comparison slider had no keyboard support; the FAQ rows were clickable `div`s; and the founder portrait (`founderPhoto`) is actually a bedroom render, so it is no longer presented as a person.

## 2. Research (inspected October 2026)

| Reference | What it does | Takeaway |
|---|---|---|
| AAT Architecten (Awwwards nominee, Oct 2026) | Statement sentence revealed line by line; a narrow portrait image that opens on scroll; image pairs at unequal widths; captions under images | One hero interaction is enough. Unequal pairs give rhythm without cards. |
| Estudio Bang (nominee, Oct 2026; WebGL, React) | A single small square image in a sea of white | Negative space as the brand |
| TARQ (Honorable Mention, Sep 2026; GSAP) | Stone-grey ground, small justified text blocks, motion-blurred photo, cities set between hairlines | A warm grey ground beats white; small text is confident |
| Norm Architects | Full-bleed photography with very small navigation | Photography first; chrome recedes |
| David Chipperfield Architects | Image floats with wide margins; plain text navigation | Framing, not cropping to the edge |
| Neri&Hu | Bilingual wordmark; image offset right; a narrow left text column | Asymmetric two-column hierarchy |
| Studio Mumbai | The home page is a satellite photo of the site plus an address | Place is the identity |
| Snøhetta (mobile) | Statement, then disciplines as large type | The "Menu" word beats a hamburger icon |
| Wiemer (nominee, Oct 2026; GSAP, Blender) | 3D product animation | 3D earns its place for an *object*. Flowspace has no 3D models, so we skip it. |
| MERSI (Codrops, Jul 2026) | Website as "between architectural book and interactive object" | Editorial pacing, print captions |

Recurring 2025–26 traits: restraint, one signature move, framed images, captions in place of overlays, and motion tied to scroll rather than decoration.

## 3. Three directions

**A. Contour.** Builds on the emblem (a site plan of contour lines with houses placed on them). Thin SVG contour lines are drawn behind content as you scroll; the palette is stone and hill green. *Risk:* the line art becomes decoration that competes with the photography. It is also heavy SVG work for little information.

**B. Nadumuttam (the courtyard).** The Kerala courtyard: a house organized around an opening to the sky. The site is organized around one aperture. The hero opens from a small framed image to the full sky, and project images open the same way as they arrive. Everything else stays quiet: a limewash ground, wet-stone text, serif prose for the studio's voice, and a grotesk for structure. *Risk:* one pinned section on the home page costs a little scroll length. That is acceptable.

**C. Monsoon ledger.** A dark, wet-stone editorial book: a horizontal scrolling drawing set, dense captions, and a drawing-sheet title block. *Risk:* the dark ground flattens the warm renders; horizontal scroll is hostile on mobile and to keyboard users.

**Chosen: B.** It comes from the region's own architecture, it gives one memorable moment rather than many effects, and it suits renders, which look best framed with margin around them.

## 4. System

- **Color:** limewash `#ECEBE5` (ground), plaster `#F6F5F1` (raised), wet stone `#1D201E` (text), mist `#7D827C` (secondary), rule `#D2D1C9`, kadappa `#202421` (footer and dark band), moss `#4B5B45` (the only accent: focus and active state).
- **Type:** Hanken Grotesk 300/400/500 for display and UI; Newsreader for the studio's voice (statements, quotes, article body); Didact Gothic only for the wordmark.
- **Grid:** 12 columns, 24px gutter on mobile and 40px on desktop. Text is left-aligned and hangs from column 4 or 7 on desktop.
- **Labels:** sentence case, small, mist colored. No all-caps eyebrows, no middle-dot meta strings. Numbers appear only for the process, which is a real sequence.

## 5. Blueprint (home)

1. **Header:** wordmark and emblem on the left; Projects, Studio, Journal, Press, Contact as plain text on the right; "Menu" on mobile opens a full-screen list with both studio addresses. Hides on scroll down, returns on scroll up.
2. **Hero, the aperture (pinned, about 1.6 screens):** "Spaces that speak for themselves." set large in light grotesk, lower left. A small portrait aperture of the courtyard image sits off-center. On scroll, the aperture opens to full bleed while the headline lifts away; a white caption names the image. Reduced motion shows the opened image statically under the headline.
3. **Studio:** a serif paragraph (the studio's own text) from column 4; a quiet facts list (two studios, 20+ services, six categories, two honours).
4. **Selected work:** three projects in alternating asymmetric compositions (wide / narrow-offset / wide), each image opening from its bottom edge once. Caption below: title, place, year, and one serif sentence.
5. **Process:** four steps on a proportional timeline, where each step's bar width equals its real duration. It reads as one horizontal bar on desktop and stacks on mobile.
6. **Client words:** one serif quote at a time with previous/next buttons and a live region.
7. **Where we work:** two columns, Wayanad and Bengaluru, places as plain comma text.
8. **Journal:** three rows with titles and dates.
9. **Questions:** an accessible accordion.
10. **Footer, the curtain:** a kadappa-dark footer sits underneath the page and is uncovered as the last section scrolls away (desktop). It carries a closing line, the email, both studios, social links, and the COA registration.

## 6. Motion plan

| Moment | Trigger | Motion | Duration |
|---|---|---|---|
| Hero headline | Page load | Lines rise from a mask, 80ms stagger | 0.9s, expo.out |
| Hero aperture | Scroll (pinned, scrub) | clip-path inset opens to 0; inner image scales 1.15→1; headline translates up and fades | Scroll-linked |
| Project images | Enter viewport (once) | clip-path opens from the bottom edge; image settles from 1.12 to 1 | 1.2s, expo.out |
| Index hover preview | Pointer over a row (fine pointer only) | Floating thumbnail follows the cursor, lerped | Continuous |
| Route change | Navigation | Content fades in 6px up | 0.5s |
| Footer | Scroll | Revealed by the page lifting off it (CSS sticky) | Native |

All of it is skipped under `prefers-reduced-motion`. Lenis is driven from the GSAP ticker so ScrollTrigger stays in sync.
