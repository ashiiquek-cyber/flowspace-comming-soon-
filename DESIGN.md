---
name: Flowspace
description: A dark room for an architecture and interiors studio, lit by one slot of daylight.
colors:
  ground: "#0D0D0C"
  text: "#E8E7E3"
  muted: "#8E8D88"
  rule: "#2A2A28"
  daylight: "#ECE9E2"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(30px, 6.4vw, 96px)"
    fontWeight: 200
    lineHeight: 1
    letterSpacing: "0.42em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(15px, 1.2vw, 18px)"
    fontWeight: 300
    letterSpacing: "0.02em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.24em"
  label-wide:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.5em"
spacing:
  gutter: "clamp(20px, 3.4vw, 56px)"
  rail-y: "clamp(22px, 2.6vw, 36px)"
  stage-gap: "clamp(20px, 2.4vw, 34px)"
  inline-gap: "24px"
  social-gap: "28px"
components:
  wordmark:
    textColor: "{colors.text}"
    typography: "{typography.display}"
  status:
    textColor: "{colors.muted}"
    typography: "{typography.label-wide}"
  rail-top:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "{spacing.rail-y} {spacing.gutter}"
  rail-bottom:
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    padding: "{spacing.rail-y} 0"
  email-link:
    textColor: "{colors.text}"
    typography: "{typography.title}"
    padding: "0 0 6px"
  social-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  social-link-hover:
    textColor: "{colors.text}"
---

# Design System: Flowspace

## Overview

**Creative North Star: "The Dark Room With One Window"**

Flowspace is presented as an unlit room. The ground is a warm near-black, the type is thin and quiet, and the only event in the space is a soft blade of daylight falling through an unseen slot window onto the floor. With no photography or portfolio to show, light itself stands in for architecture: the page is about proportion, restraint and one carefully placed source of illumination.

Density is minimal. One full-height viewport holds three bands: a top rail of small spaced caps, a centred stage with the wordmark and a single line of status, and a bottom rail sitting above one hairline. Everything is achromatic and warm-neutral; the email address is the only element drawn at full text brightness outside the wordmark, because writing to the studio is the only action.

Motion is slow and atmospheric, never decorative. The light fades in like dawn, the wordmark and status settle out of blur once, and the light blade drifts across the room on a long sine sweep while leaning gently toward the pointer. All of it stops under reduced motion.

**Key Characteristics:**
- Warm near-black ground with warm off-white and muted grey type; no hue.
- Archivo only, weights 200 to 400, the wordmark in the widest cut (wdth 125).
- Generous letter-spacing on every uppercase line, optically balanced when centred.
- One 1px hairline rule as the only drawn line.
- One light effect: a translucent, blurred, skewed blade of daylight.
- Square, unbordered, unshadowed; nothing is a card.

## Colors

A warm achromatic palette: four greys from near-black to paper, plus one translucent daylight used only as light.

### Primary
- **Paper White** (text): The wordmark, the email address and focus outlines. It is the brightest element on the page and marks what matters; selection inverts to it.

### Neutral
- **Unlit Room** (ground): The whole page background and `theme-color`. Never interrupted by panels or tints.
- **Dusk Grey** (muted): Rail labels, status line, statement and social links at rest. Reads at about 5.8:1 on the ground, so it stays legible at 11px.
- **Hairline** (rule): The single 1px rule above the bottom rail. Too low in contrast for text; it is a line colour only.
- **Daylight** (daylight): The light blade and its floor patch, only ever at 0.02 to 0.16 alpha, always as a gradient. Never a fill, never a text colour.

### Named Rules
**The One Light Rule.** The daylight blade is the world's single light effect. Translucent gradients and blur belong to it and to nothing else on the page; no other element glows, tints or blurs at rest.

**The Bright-Means-Act Rule.** Outside the wordmark, only the actionable thing (the email, and a social link on hover) is drawn in Paper White. Everything informational stays in Dusk Grey.

## Typography

**Display Font:** Archivo (with Helvetica Neue, Arial, sans-serif), variable width and weight
**Body Font:** Archivo (same stack)

**Character:** One family carrying the whole system through width and weight alone: a thin, extra-wide wordmark for presence, light regular text for the rails, and generous tracking on caps to make small type feel architectural rather than loud.

### Hierarchy
- **Display** (200, clamp(30px, 6.4vw, 96px), line-height 1, 0.42em tracking, wdth 125, uppercase): The FLOWSPACE wordmark only. On screens up to 720px it drops to 8.4vw with 0.28em tracking.
- **Title** (300, clamp(15px, 1.2vw, 18px), 0.02em tracking): The email address, the primary action. 18px on small screens.
- **Body** (400, 14px, line-height 1.6): Base text size.
- **Body small** (400, 13px, line-height 1.6): The bottom-rail statement, held to 30ch.
- **Label** (400, 11px, 0.24em tracking, uppercase): Top rail and social links. Tightens to 0.14em on small screens.
- **Label wide** (400, 11px, 0.5em tracking, uppercase): The status line beneath the wordmark.

### Named Rules
**The Thin Voice Rule.** Weights stay between 200 and 400. Nothing on the page is bold; emphasis comes from size, width and brightness.

**The Balanced Tracking Rule.** Any centred tracked line carries a negative right margin equal to its letter-spacing (-0.42em on the wordmark, -0.5em on the status), so the trailing space does not push it off centre.

## Layout

The page is a single full-viewport grid (`min-height: 100svh`, rows auto / 1fr / auto) with overflow hidden: top rail, centred stage, bottom rail. Horizontal margins use one fluid gutter (clamp(20px, 3.4vw, 56px)); rails use a fluid vertical padding (clamp(22px, 2.6vw, 36px)).

The top rail is justified space-between: practice label left, location right. The stage centres the wordmark and status with a fluid gap (clamp(20px, 2.4vw, 34px)). The bottom rail is inset by the gutter so its hairline stops short of the viewport edges, and aligns three items to the baseline: statement left, email centre, socials right, 24px apart. At 720px and below the bottom rail stacks into a left-aligned column with 22px gaps.

## Elevation & Depth

The system is flat. There are no box-shadows anywhere. Depth comes from light only: the layered daylight blade (a vertical shaft blurred 18px, a skewed floor patch blurred 6px with a 1px brighter leading edge) sits behind the content, and all content sits on z-index 1 above it. Do not add shadows or raised surfaces; if something needs separation, it gets space or the hairline.

### Named Rules
**The Light-Is-Depth Rule.** The only sense of volume on the page comes from the daylight falling into the room. Surfaces never lift.

## Shapes

Every edge is square and nothing is boxed. There are no radii, no borders except the single hairline top rule on the bottom rail, and no containers. The only non-orthogonal geometry is the light: the shaft skews -8deg and the floor patch skews -38deg, which reads as sunlight raking across a floor.

## Components

### Email Link (primary action)
Quiet but unmistakably the action.
- **Rest:** Paper White, title type, 6px bottom padding, with a 1px Paper White underline drawn as a background gradient across the full width.
- **Hover / Focus:** The underline withdraws to the right (background-size to 0%) while tracking opens from 0.02em to 0.06em, both over 0.6s on the standard ease. Focus also shows the global 1px outline at 6px offset.

### Social Links
- **Rest:** Dusk Grey, label type (11px caps, 0.24em), 28px apart, no underline.
- **Hover:** Colour rises to Paper White over 0.3s.

### Rails
- **Top rail:** Dusk Grey label caps, space-between, practice name left and location right. Meta information only, never a heading label.
- **Bottom rail:** Dusk Grey 13px sentence case, sitting above the 1px hairline, statement / email / socials.

### Wordmark and Status
- **Wordmark:** Display type in Paper White; settles from 6px blur and zero opacity over 2.4s after 0.4s, once.
- **Status:** Label-wide caps in Dusk Grey beneath; the same settle at 0.9s.

### Light Blade (signature)
A shaft of daylight through an unseen slot window: a vertical gradient (0.10 to 0 alpha) clamp(90px, 11vw, 180px) wide, skewed -8deg, blurred 18px, ending at 78% height where a skewed floor patch (0.07 to 0.02 alpha, 1px 0.16-alpha leading edge, blurred 6px) takes over. The whole light fades in over 3.2s. Its horizontal position is driven by one custom property that drifts plus or minus 10% around 62% on a roughly 90-second sine sweep and leans up to 3% toward the pointer with heavy easing. It never receives pointer events and is hidden from assistive technology. Under reduced motion it is static.

## Do's and Don'ts

### Do:
- **Do** keep the ground Unlit Room edge to edge and let content sit directly on it.
- **Do** keep type in Archivo between weights 200 and 400, using the wdth axis for the wordmark.
- **Do** track uppercase lines generously (0.24em for labels, 0.5em for status) and balance centred tracking with a matching negative right margin.
- **Do** reserve Paper White for the wordmark and the actionable element.
- **Do** use the standard ease (cubic-bezier(0.16, 1, 0.3, 1)) and long, slow durations (0.3s to 3.2s); remove all of it under prefers-reduced-motion.
- **Do** use the daylight blade, with its translucent gradients and blur, as the single light effect.

### Don't:
- **Don't** add a second light, glow, tint or blur; the One Light Rule allows exactly one.
- **Don't** add shadows, cards, rounded corners or borders beyond the single hairline rule.
- **Don't** introduce hue; the palette is warm achromatic.
- **Don't** use bold weights or a second typeface.
- **Don't** set small caps labels above headings as kickers; tracked caps live in the rails and the status line only.
- **Don't** use the Hairline grey or Daylight for text.
