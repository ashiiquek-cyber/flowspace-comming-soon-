# Scroll interactions: research and plan

Written 2026-11-20. This extends §6 of [REDESIGN.md](REDESIGN.md), which kept motion to one signature move (the hero aperture) and cut per-element "lag" parallax as motion with no meaning. The goal here is to carry the hero's scroll language through the rest of the site without breaking that rule.

## 1. Research (November 2026)

Each finding is marked *observed* (seen in the browser or probed in the page's DOM) or *inferred* (from Awwwards tags or static screenshots only).

| Reference | What it does | Takeaway for Flowspace |
|---|---|---|
| ERA Residence (Site of the Month, Aug 2026; The First The Last) | *Observed:* Lenis, GSAP and ScrollTrigger, with no pin-spacers: pinned scenes are CSS `sticky` screens inside tall scroll areas. Vertical hairlines draw in through `clip-path: inset(0 0 100%)`. Images open from their bottom edge (`inset(100% 0 0)`). A location path is revealed left to right. About 1,700 split-text nodes. | Our stack is already the award-site stack. Lines drawn in and images opening from an edge are the vocabulary; we already have the second. |
| SANTAL (Site of the Day, 15 Nov 2026) | *Observed:* a huge wordmark folds into the nav, then a single statement sits on a visible column grid. A long dark section flies a 3D field of words around the camera. A hairline under the active nav item shows progress through each section. | The visible grid and the hairline are on brand. The 3D word field is spectacle with no tie to boxes or lines, so we skip it. |
| Kononenko Architectural Bureau (Site of the Day, Aug 2026) | *Observed (screenshots):* preloader counter, then a full-bleed image that settles into a framed image under the headline; large serif statements set across the page. *Inferred:* the statements fill word by word with scroll. | A statement that fills as you read it ties motion to reading. |
| LPAS (Site of the Day, Oct 2026; Studio Naam) | *Observed (screenshots):* the hero headline stays pinned while the photograph behind it changes at each scroll step. | Stepped, pinned sequences suit content that really is a sequence. Ours is the Process. |
| Verticité Architecture, ERA Residence (Awwwards "horizontal scroll") | *Inferred:* pinned horizontal galleries. | Rejected again: REDESIGN.md cut horizontal scroll for phones and keyboard users. |
| Codrops: Sticky Grid Scroll, SVG Mask Transitions (Mar 2026) | *Inferred* (the articles refused automated fetches): scroll-driven grids in a sticky frame; mask reveals in blind and grid patterns. | Confirms the sticky-scene and mask patterns; nothing beyond ERA's. |

## 2. The test every interaction must pass

The studio draws every building as **boxes** (the parts of life) and **flowing lines** (movement, light and air), and the site's signature is the **aperture**: a courtyard opening to the sky. A scroll interaction stays only if it shows one of those three things:

- **Boxes:** something is assembled, box by box.
- **Lines:** a line is drawn, or something is read or lit along a line.
- **Aperture:** a frame opens.

Anything that only moves (parallax, tilt, scroll-velocity skew, 3D word fields) fails, so it's out.

## 3. The plan

Ranked by how much each one says. The top two are the substantial ones.

| # | Where | Interaction | Passes as | Trigger |
|---|---|---|---|---|
| 1 | Home, Process | **The house assembles.** On desktop the four steps pin. As you scroll, each step lights in turn, its new box drops onto the stack, and its bar on the timeline draws out from the left. By the fourth step the house stands. | Boxes + lines | Pinned, scrubbed (desktop ≥1024px wide and ≥720px tall). Phones: each row plays once as it arrives. |
| 2 | Statements on every page | **Statements fill as you read.** Serif statements start in a pale stone tone and each word turns to ink as it passes the reading line. | Lines (reading) | Scrubbed, all sizes. SplitText re-splits after Newsreader loads. |
| 3 | Sun study | **The sun crosses the sky with your scroll.** While the model passes through the screen, the time of day moves from 7 am to 5 pm. The moment you touch the slider, a season or the model, it's yours and the scroll lets go. | Lines (light) | Scrubbed, no pin. |
| 4 | Wide images (home feature, project hero, studio photograph) | **The courtyard opens.** Full-width images start inset from both sides and open to the full frame as they rise, echoing the hero. Smaller images keep their one-shot rise from the bottom edge. | Aperture | Scrubbed. |
| 5 | Hairlines on every page | **The drawing is drawn.** The rules between rows, facts and list items draw from left to right as they arrive, in a short stagger. | Lines | Once per rule. |
| 6 | Page titles | **Titles rise from a mask**, line by line, as the hero headline does. | Matches the hero | Once, on load. |

Not doing: inner-image parallax, horizontal galleries, cursor followers beyond the existing index preview, scroll-velocity effects, a preloader.

## 4. Build notes

- **Shared pieces:** `components/TextMotion.tsx` (`WordFill`, `LineRise`, built on GSAP 3.13's free SplitText with `autoSplit` and `aria: 'auto'`); `lib/useRuleDraw.ts` (hairlines); an `open` mode on `Aperture`.
- **Nothing hidden in CSS.** Start states are set by script in `useLayoutEffect`. With reduced motion or no script, everything renders in its final state.
- **Scroll transforms never share an element with a CSS transition.** `Aperture` scales an inner wrapper, so the hover zoom on the image stays smooth.
- **Pins only in eagerly mounted components.** The lazy sun study adds a plain trigger, not a pin, so it can't shift the Process pin below it.
- **No transformed ancestors around pinned sections.** `.page-enter` stays opacity only.
- **Phones get one-shot versions** of anything pinned, to keep the work in the scroll handler small.
