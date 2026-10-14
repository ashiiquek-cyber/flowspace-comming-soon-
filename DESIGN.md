---
name: Flowspace
description: Architecture and interiors studio; space composed with colour.
colors:
  chalk: "#DCDDD9"
  ink-dark: "#1C1C1A"
  outremer: "#34427A"
  ocre: "#C9963E"
  vermillon: "#9E3A27"
  vert: "#3D5A47"
  terre: "#4E3A30"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "8.4vw"
    fontWeight: 700
    lineHeight: 0.74
    letterSpacing: "-0.035em"
    fontVariation: "\"wdth\" 125"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(20px, 1.9vw, 30px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 112"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: "\"wdth\" 100"
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.08em"
    fontVariation: "\"wdth\" 100"
  label-sm:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 100"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 2.8vw, 40px)"
  stack: "14px"
  inline: "20px"
components:
  rail:
    textColor: "{colors.ink-dark}"
    typography: "{typography.label}"
    height: "64px"
    padding: "0 clamp(16px, 2.8vw, 40px)"
  field-label:
    typography: "{typography.label-sm}"
  frame-tag:
    backgroundColor: "{colors.ink-dark}"
    textColor: "{colors.chalk}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: "7px 10px 6px"
  email-link:
    textColor: "{colors.ink-dark}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "2px 0 4px"
  email-link-hover:
    backgroundColor: "{colors.outremer}"
    textColor: "{colors.chalk}"
  social-link:
    textColor: "{colors.ink-dark}"
    typography: "{typography.label}"
---

# Design System: Flowspace

## Overview

**Creative North Star: "The Colour Keyboard"**

Flowspace composes space with colour. The system is a wall-scale architectural colour keyboard in the tradition of Polychromie architecturale: flat matte pigment fields set on a cool chalk ground, measured by hairline rules and labelled like a pigment sample card. Nothing is lit, glossy or photographic; the pigments themselves carry the atmosphere, and a heavy black viewing frame isolates one combination at a time.

Density is low and the measure is strict. Everything sits on a fourteen-module grid between two gutters. Pigment fields snap to whole modules, the frame spans exactly four, the wordmark fills nine on the chalk beneath the fields, and contact lives in the last four. Type is one family, Archivo, used for its width axis: very wide and heavy for the wordmark, normal width for text, small tracked capitals for sample-card labelling.

Motion is architectural, not decorative: fields rise into place once, staggered, and the frame glides on a long ease-out. The one live colour on the chalk ground, the email underline, is borrowed from whatever pigment the frame holds.

**Key Characteristics:**
- Flat matte pigment fields; no tints, gradient colour transitions, shadows or opacity.
- Fourteen-module grid; every field, frame and text block snaps to whole modules.
- Hairline ink rules (1px) and one heavy ink frame (6px) are the only line weights.
- Archivo alone, varied by its width axis (wdth 100 / 112 / 125).
- Square corners everywhere.
- The accent is not fixed; it follows the framed pigment.

## Colors

Five earthy architectural pigments, a cool chalk ground and a warm near-black ink, all used flat at full strength.

### Primary
- **Outremer** (ultramarine): the first pigment on the keyboard and the default accent, so it is the colour of the email underline and hover fill at rest.

### Secondary
- **Ocre** (yellow ochre): the one light pigment; its field label is set in ink rather than chalk because chalk text fails on it.
- **Vermillon** (earth vermilion red): the widest warm field.

### Tertiary
- **Vert** (vert anglais, deep English green) and **Terre** (terre d'ombre, raw umber): the quiet closing pair of the keyboard.

### Neutral
- **Chalk** (cool pale grey): the page ground, the empty void field, selection text, and text on dark pigments and on the frame tag.
- **Ink** (warm near-black): all body text, hairline rules, the viewing frame, the frame tag fill, focus outlines and text selection fill. The rule colour is the same ink, not a separate grey.

### Named Rules
**The Full-Strength Rule.** Pigments are applied flat and opaque at their exact value. No tints, shades, transparency or blended transitions between them; to vary colour, choose a different pigment.

**The Accent Follows the Frame Rule.** The accent is a binding, not a colour: it takes the dominant pigment inside the viewing frame (Outremer at rest). It appears only on the primary action's underline and hover fill, never as a decorative fill elsewhere.

**The Sample Card Rule.** Each pigment field carries its number and name in small tracked capitals at the bottom-left (for example "32020 Outremer"), in chalk on dark pigments and ink on Ocre. Exactly one field is left empty, chalk-filled and unlabelled.

## Typography

**Display Font:** Archivo, wide cut (wdth 125), with Helvetica Neue, Arial fallback
**Body Font:** Archivo, normal cut (wdth 100)
**Label Font:** Archivo, normal cut, tracked capitals

**Character:** One grotesque stretched across its width axis. The wide, heavy cut reads as a built thing; the normal cut stays plain and precise.

### Hierarchy
- **Display** (700, wdth 125, fitted to the module span; 8.4vw before fitting, line-height 0.74, -0.035em, uppercase): the FLOWSPACE wordmark only. Script fits its width to nine modules on desktop and the full keyboard width at 760px and below.
- **Headline** (600, wdth 112, clamp(20px, 1.9vw, 30px), line-height 1.15, -0.01em): the primary action, the email address.
- **Body** (400, 14px desktop / 16px mobile, line-height 1.5, max 40ch): the single statement paragraph.
- **Label** (500, 12px, 0.08em, uppercase): rails and social links. Rails drop to 11px on small screens.
- **Label small** (500, 11px, 0.08em, uppercase, tabular numerals): pigment field labels and the frame tag.

### Named Rules
**The One Family Rule.** Archivo is the only typeface. Hierarchy comes from the width axis, weight and case, never from a second family.

**The Width Is the Voice Rule.** Only the wordmark uses the widest cut (wdth 125); the primary action uses the intermediate cut (wdth 112); all other text stays at normal width.

## Layout

A fourteen-column module grid spans the viewport between gutters of clamp(16px, 2.8vw, 40px). The page is a three-row full-height grid: top rail (64px, 52px on small screens), the keyboard taking the remaining height (min 320px, 300px on small screens), and the close below.

- **Top rail:** practice at modules 1 to 4, location at 7 to 10, status right-aligned at 11 to 14. At 760px and below the status item is removed and location right-aligns.
- **Keyboard:** pigment fields span whole modules (4, 2, 3, 1 void, 2, 2 = 14). Hairline rules run above and below.
- **Close:** the wordmark spans modules 1 to 9 on the chalk ground beneath the fields, bottom-aligned with contact at modules 11 to 14 (14px stack gap, 20px between social links). At 760px and below both stack full-width with 28px between them.
- **Breakpoint:** a single breakpoint at 760px. On small screens field labels rotate -90deg to read up the field.

### Named Rules
**The Whole Module Rule.** Every field, frame position and block placement snaps to a whole module of the fourteen. No half modules, no free positioning.

## Elevation & Depth

The system is completely flat. There are no shadows, no blur and no tonal layering. Depth is conveyed only by overlap: the viewing frame sits over the fields and overhangs them by 10px top and bottom (8px on small screens), and its tag hangs below the keyboard on the chalk.

### Named Rules
**The Flat Wall Rule.** Surfaces never lift. Emphasis is made with ink weight (1px hairline versus 6px frame) and with colour, never with shadow.

## Shapes

Square corners throughout (0px radius); every surface is a rectangle. Lines come in two weights only: the 1px ink hairline (keyboard top and bottom, the void field's sides) and the 6px ink frame border (4px on small screens). Fields enter with a bottom-to-top clip reveal rather than a fade.

## Components

### Pigment Field
Flat, full-height rectangle of one pigment spanning whole modules, labelled per the Sample Card Rule. Rises in once from the bottom (clip-path, 1.4s, ease cubic-bezier(0.16, 1, 0.3, 1)), staggered by 0.06s per field. The void field is chalk, bordered by hairlines on both sides, unlabelled and hidden from assistive tech.

### Viewing Frame (signature)
A four-module rectangle with a 6px ink border and no fill, overhanging the keyboard by 10px. It is a slider: drag it, tap the keyboard to move it, or use arrow, Home and End keys. Moves glide over 1.1s on the house ease; while dragging, transitions are off. Its tag (ink fill, chalk label-small text, 7px 10px 6px padding) hangs flush below the frame's left edge and names the framed pigments ("Outremer / Ocre"). On load it glides once from module 0 to its resting position to show it can move.

### Rails
Plain rows of label-style text on chalk, placed on the module grid. No background, border or divider.

### Email Link (primary action)
- **Shape:** square, 2px 0 4px padding.
- **Default:** ink headline text with a 4px solid accent underline drawn as a background fill.
- **Hover / Focus:** the accent fill rises to cover the full text box over 0.5s on the house ease and the text turns chalk.

### Social Links
Label-style tracked capitals, 20px apart. Hover draws a 1px current-colour underline (0.3s).

### Focus
All focusable elements use a 2px ink outline offset 4px (6px on the frame). Reduced motion disables the field rise and all transitions.

## Do's and Don'ts

### Do:
- **Do** apply pigments flat and opaque at their exact token values.
- **Do** snap every field and block to whole modules of the fourteen-column grid.
- **Do** label pigment fields with number and name in 11px tracked capitals, chalk on dark pigments and ink on Ocre.
- **Do** bind the accent to the framed pigment and use it only on the primary action.
- **Do** keep Archivo as the only family and vary it by width axis: wdth 125 for the wordmark, 112 for the primary action, 100 for everything else.
- **Do** use only two line weights: 1px ink hairlines and the 6px ink frame.
- **Do** use the house ease cubic-bezier(0.16, 1, 0.3, 1) for reveals and glides, and honour reduced motion.

### Don't:
- **Don't** use tints, opacity, or gradient colour transitions between pigments. A solid single-colour background fill used to draw an underline is allowed.
- **Don't** add shadows, blur or glows; the wall is flat.
- **Don't** round corners.
- **Don't** introduce a second typeface or a grey that is not chalk or ink.
- **Don't** use the accent as a decorative fill outside the primary action.
- **Don't** label the void field or add a second empty field.
